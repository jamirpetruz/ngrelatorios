import { getSQLServerPool } from "@/lib/db";
import { IUser } from "@/types/User";
import bcrypt from 'bcrypt'
import {Bit} from 'mssql'

export async function findUserByUsername(username: string): Promise<IUser | null>{
    const pool = await getSQLServerPool()
    const sql = `SELECT * from dbo.Users WHERE username = @username`

    try {
        const result = await pool
            .request()
            .input('username', username)
            .query(sql)
        return result.recordset[0] as IUser
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function createUser(user: IUser): Promise<IUser | null>{
    const pool = await getSQLServerPool()
    const sql = `INSERT INTO dbo.Users (username, name, email, password, role) 
                 VALUES (@username, @name, @email, @password, @role);
                 SELECT * FROM dbo.Users WHERE userId = SCOPE_IDENTITY();`
    try {
        const passwordHash = await bcrypt.hash(user.password, 10)
        const result = await pool
            .request()
            .input('username', user.username)
            .input('name', user.name)
            .input('email', user.email)
            .input('password', passwordHash)
            .input('role', user.role)
            .query(sql)
        return result.recordset[0] as IUser
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getAllUsers(): Promise<IUser[]> {
    const pool = await getSQLServerPool()
    const sql = `SELECT * from dbo.Users`

    try {
        const result = await pool.query(sql)
        return result.recordset as IUser[]
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function updateUser(
  userId: number,
  user: IUser
): Promise<IUser | null> {
  const pool = await getSQLServerPool();

  try {
    const request = pool
      .request()
      .input("userId", userId)
      .input("username", user.username)
      .input("name", user.name)
      .input("email", user.email)
      .input("role", user.role)
      .input("ativo", Bit, user.ativo);

    let passwordSQL = "";

    // Só altera a senha se uma nova senha foi informada
    if (user.password?.trim()) {
      const passwordHash = await bcrypt.hash(user.password, 10);

      request.input("password", passwordHash);
      passwordSQL = ", password = @password";
    }

    const sql = `
      UPDATE dbo.Users
      SET
        username = @username,
        name = @name,
        email = @email,
        role = @role,
        ativo = @ativo
        ${passwordSQL}
      OUTPUT
        INSERTED.userId,
        INSERTED.username,
        INSERTED.name,
        INSERTED.email,
        INSERTED.ativo,
        INSERTED.role
      WHERE userId = @userId;
    `;

    const result = await request.query(sql);

    return (result.recordset?.[0] as IUser) ?? null;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return null;
  }
}