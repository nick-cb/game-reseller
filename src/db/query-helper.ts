import { db } from '@/db/connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

type Primitive = string | number | bigint | boolean | null | undefined;
function isTemplateLitteral(
  strings: TemplateStringsArray,
  ...values: (Primitive | Primitive[] | SQL)[]
) {
  return !!(
    strings &&
    strings.length > 0 &&
    strings.raw &&
    strings.raw.length === strings.length &&
    Object.isFrozen(strings) &&
    values.length + 1 === strings.length
  );
}

class SQL {
  constructor(
    private strings: TemplateStringsArray,
    private values: (Primitive | Primitive[] | SQL)[]
  ) {}

  toQuery() {
    let finalQuery = '';
    let finalValues: (Primitive | Primitive[])[] = [];
    for (let i = 0; i < this.values.length; i++) {
      const value = this.values[i];
      const str = this.strings[i];
      if (value instanceof SQL) {
        const { query, values } = value.toQuery();
        finalQuery += `${str}${query}`;
        finalValues.push(...values);
        continue;
      }
      finalQuery += `${str} ?`;
      finalValues.push(value);
    }
    finalQuery += this.strings.at(-1) ?? '';
    return { query: finalQuery, values: finalValues };
  }
}

export function sql(
  strings: TemplateStringsArray,
  ...values: (Primitive | SQL | Primitive[])[]
): SQL {
  if (!isTemplateLitteral(strings, ...values)) {
    throw new Error('Incorrect template litteral call');
  }

  return new SQL(strings, values);
}

type QueryOptions = {
  debugQuery?: boolean;
};
const defaultQueryOptions: QueryOptions = {
  debugQuery: false,
};
export async function query<T extends any[]>(
  params: ReturnType<typeof sql>,
  options: QueryOptions = defaultQueryOptions
) {
  const { debugQuery } = options;
  const { query, values } = params.toQuery();
  try {
    if (debugQuery) {
      const sql = db.connection.format(query, values);
      console.log(sql);
    }
    const result = await db.connection.query<T>(query, values);
    db.connection.release();
    return { data: result[0] || [] } as { data: T };
  } catch (error) {
    db.connection.release();
    throw error;
  }
}

export async function querySingle<T extends any>(
  params: ReturnType<typeof sql>,
  options: QueryOptions = defaultQueryOptions
) {
  const { debugQuery } = options;
  const { query, values } = params.toQuery();
  try {
    if (debugQuery) {
      const sql = db.connection.format(query, values);
      console.log(sql);
    }
    const result = await db.connection.query<RowDataPacket[]>(query, values);
    db.connection.release();

    const data = result[0][0];
    if (data) {
      return { data } as { data: T };
    }
    return { data: undefined };
  } catch (error) {
    db.connection.release();
    throw error;
  }
}

export async function insert(params: ReturnType<typeof sql>) {
  const { query, values } = params.toQuery();
  try {
    const result = await db.connection.query<RowDataPacket[]>(query, values);
    db.connection.release();
    return { data: result };
  } catch (error) {
    db.connection.release();
    throw error;
  }
}

export async function insertSingle(params: ReturnType<typeof sql>) {
  const { query, values } = params.toQuery();
  try {
    const result = await db.connection.query<ResultSetHeader>(query, values);
    db.connection.release();
    return { data: result[0] };
  } catch (error) {
    db.connection.release();
    throw error;
  }
}

export async function updateSingle(params: ReturnType<typeof sql>) {
  const { query, values } = params.toQuery();
  try {
    const result = await db.connection.query<RowDataPacket[]>(query, values);
    db.connection.release();
    return { data: result[0][0] };
  } catch (error) {
    db.connection.release();
    throw error;
  }
}
