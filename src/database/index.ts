import mysql from "mysql2/promise";

export const connection = mysql.createConnection(
    process.env.DATABASE_URL || ""
);
export const connectDB = async () => {
    try {
        const connection = await mysql.createConnection(
            process.env.DATABASE_URL || ""
        );
        await connection.connect();
        return connection;
    } catch (error: any) {
        process.exit(1);
    }
};
export const sql = String.raw;