import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { z } from 'zod';

// export const connection = mysql.createConnection(
//   process.env.DATABASE_URL || "",
// );
export const connectDB = async () => {
  // try {
  //   const connection = await mysql.createConnection({
  //     host: "localhost",
  //     port: 3306,
  //     database: "game_reseller",
  //     user: "root",
  //   });
  //   await connection.connect();
  //   return connection;
  // } catch (error: any) {
  //   process.exit(1);
  // }
};

export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: 3306,
  database: process.env.DATABASE_NAME ?? 'game_reseller',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectTimeout: 30000,
});

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
  const connection = await pool.getConnection();
  try {
    if (debugQuery) {
      const sql = connection.format(query, values);
      console.log(sql);
    }
    const result = await connection.query<T>(query, values);
    connection.release();
    return { data: result[0] || [] } as { data: T };
  } catch (error) {
    connection.release();
    throw error;
  }
}

export async function querySingle<T extends any>(
  params: ReturnType<typeof sql>,
  options: QueryOptions = defaultQueryOptions
) {
  const { debugQuery } = options;
  const { query, values } = params.toQuery();
  const connection = await pool.getConnection();
  try {
    if (debugQuery) {
      const sql = connection.format(query, values);
      console.log(sql);
    }
    const result = await connection.query<RowDataPacket[]>(query, values);
    connection.release();

    const data = result[0][0];
    if (data) {
      return { data } as { data: T };
    }
    return { data: undefined };
  } catch (error) {
    connection.release();
    throw error;
  }
}

export async function insert(params: ReturnType<typeof sql>) {
  const { query, values } = params.toQuery();
  const connection = await pool.getConnection();
  try {
    const result = await connection.query<RowDataPacket[]>(query, values);
    connection.release();
    return { data: result };
  } catch (error) {
    connection.release();
    throw error;
  }
}

export async function insertSingle(params: ReturnType<typeof sql>) {
  const { query, values } = params.toQuery();
  const connection = await pool.getConnection();
  try {
    const result = await connection.query<ResultSetHeader>(query, values);
    return { data: result[0] };
  } catch (error) {
    connection.release();
    throw error;
  }
}

export async function updateSingle(params: ReturnType<typeof sql>) {
  const { query, values } = params.toQuery();
  const connection = await pool.getConnection();
  try {
    const result = await connection.query<RowDataPacket[]>(query, values);
    return { data: result[0][0] };
  } catch (error) {
    connection.release();
    throw error;
  }
}
