import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

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
  host: 'localhost',
  port: 3306,
  database: 'game_reseller',
  user: 'root',
  waitForConnections: true,
  connectTimeout: 30000,
});

type Primitive = string | number | bigint | boolean | null | undefined;
function isTemplateLitteral(strings: TemplateStringsArray, ...values: Primitive[]) {
  return !!(
    strings &&
    strings.length > 0 &&
    strings.raw &&
    strings.raw.length === strings.length &&
    Object.isFrozen(strings) &&
    values.length + 1 === strings.length
  );
}

export function sql(strings: TemplateStringsArray, ...values: Primitive[]): [string, Primitive[]] {
  if (!isTemplateLitteral(strings, ...values)) {
    throw new Error('Incorrect template litteral call');
  }

  let query = strings[0] ?? '';
  for (const str of strings.slice(1)) {
    query += `?${str ?? ''}`;
  }
  const newValues = values.map((value) => {
    if (value === undefined) {
      return null;
    }
    return value;
  });
  return [query, newValues];
}

export async function query<T extends any[]>(params: ReturnType<typeof sql>) {
  const [query, values] = params;
  const connection = await pool.getConnection();
  try {
    const result = await connection.query<T>(query, values);
    connection.release();
    return { data: result[0] || [] } as { data: T };
  } catch (error) {
    connection.release();
    throw error;
  }
}

export async function querySingle<T extends any>(params: ReturnType<typeof sql>) {
  const [query, values] = params;
  const connection = await pool.getConnection();
  try {
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
  const [query, values] = params;
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
  const [query, values] = params;
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
  const [query, values] = params;
  const connection = await pool.getConnection();
  try {
    const result = await connection.query<RowDataPacket[]>(query, values);
    return { data: result[0][0] };
  } catch (error) {
    connection.release();
    throw error;
  }
}
