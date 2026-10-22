'use server'

import { createUser, getAllUsers, updateUser } from "@/service/rh/usuarios";
import { IUser } from "@/types/User";

export async function createUsuarioActions(user: IUser): Promise<IUser | null> {
    const createdUser = await createUser(user);
    return createdUser;
}

export async function getAllUsuariosActions(): Promise<IUser[]> {
    const users = await getAllUsers();
    return users;
}

export async function updateUsuarioActions(userId: number, user: IUser): Promise<IUser | null> {
    const updatedUser = await updateUser(userId, user);
    return updatedUser;
}