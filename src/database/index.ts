import mysql from "mysql2/promise";

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

const pool = mysql.createPool({
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

export async function sql(
  strings: TemplateStringsArray,
  ...values: Primitive[]
) {
  if (!isTemplateLitteral(strings, ...values)) {
    throw new Error("Incorrect template litteral call");
  }

  let query = strings[0] ?? "";
  for (const str of strings.slice(1)) {
    query += `?${str ?? ""}`;
  }

  return pool.query(query, values);
}
