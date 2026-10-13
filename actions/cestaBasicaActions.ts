'use server'

import { findCestasBasicas, findCestasBasicasNovo } from "@/service/cestasBasicas";

export async function findCestasBasicasAction(mes: string, empresa: string) {
    const result = await findCestasBasicas(empresa, mes)
    return result;
}   

export async function findCestasBasicasNovoAction(mes: string, empresa: string) {
    const result = await findCestasBasicasNovo(empresa, mes)
    return result;
}