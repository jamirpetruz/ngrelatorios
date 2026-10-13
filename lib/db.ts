import sql from 'mssql'
import bcrypt from 'bcrypt'

export async function getSQLServerPool(): Promise<sql.ConnectionPool> {

    const sqlConfig: sql.config = {
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: process.env.SQL_DATABASE,
        port: Number(process.env.SQL_PORT),
        server: process.env.SQL_SERVER!,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            trustServerCertificate: true
        }
    }
    try {
        const pool = await sql.connect(sqlConfig)

        await pool.query(`
                IF OBJECT_ID('dbo.Users', 'U') IS NULL
                BEGIN
                    CREATE TABLE dbo.Users (
                        userId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
                        username VARCHAR(200) UNIQUE NOT NULL,
                        name VARCHAR(200) NOT NULL,
                        email VARCHAR(200) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        role VARCHAR(20) NOT NULL DEFAULT 'user',
                        createdAt DATETIME2 DEFAULT CURRENT_TIMESTAMP
                    );
                END;
                `)
        /*
        const passwordHash = await bcrypt.hash('admin@123', 10)
        await pool.query(`
        INSERT INTO dbo.Users(username, name, email, password, role) VALUES(
            'admin', 'admin', 'admin@admin.com', '${passwordHash}', 'admin'
        )`)*/
        return pool
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getNGPool(): Promise<sql.ConnectionPool> {

    const sqlConfig: sql.config = {
        user: process.env.NG_USER,
        password: process.env.NG_PASS,
        database: process.env.NG_DATABASE,
        port: Number(process.env.NG_PORT),
        server: process.env.NG_HOST!,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            trustServerCertificate: true
        }
    }
    try {
        const pool = await sql.connect(sqlConfig)
        return pool
    } catch (error) {
        console.log(error)
        throw error
    }
}