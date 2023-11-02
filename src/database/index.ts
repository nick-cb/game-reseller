import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export const connection = mysql.createConnection(
  process.env.DATABASE_URL || "",
);
export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(
      process.env.DATABASE_URL || "",
    );
    await connection.connect();
    return connection;
  } catch (error: any) {
    process.exit(1);
  }
};

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || "",
  waitForConnections: true,
});

type Primitive = string | number | bigint | boolean | null | undefined;
function isTemplateLitteral(
  strings: TemplateStringsArray,
  ...values: Primitive[]
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

export function sql(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): [string, Primitive[]] {
  if (!isTemplateLitteral(strings, ...values)) {
    throw new Error("Incorrect template litteral call");
  }

  let query = strings[0] ?? "";
  for (const str of strings.slice(1)) {
    query += `?${str ?? ""}`;
  }
  const newValues = values.map((value) => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    if (!value) {
      return null;
    }
    return value;
  });
  return [query, newValues];
}

export async function query<T extends any[]>(params: ReturnType<typeof sql>) {
  const [query, values] = params;
  const result = await pool.query<T>(query, values);
  return { data: result[0] || [] } as { data: T };
}

export async function querySingle<T extends any>(
  params: ReturnType<typeof sql>,
) {
  const [query, values] = params;
  const result = await pool.query<RowDataPacket[]>(query, values);
  const data = result[0][0];
  if (data) {
    return { data } as { data: T };
  }
  return { data: null };
}

export async function insert(params: ReturnType<typeof sql>) {
  const [query, values] = params;
  const result = await pool.query<RowDataPacket[]>(query, values);
  return { data: result[0] };
}

export async function insertSingle(params: ReturnType<typeof sql>) {
  const [query, values] = params;
  const result = await pool.query<ResultSetHeader[]>(query, values);
  return { data: result[0][0] };
}

export async function updateSingle(params: ReturnType<typeof sql>) {
  const [query, values] = params;
  const result = await pool.query<RowDataPacket[]>(query, values);
  return { data: result[0][0] };
}
