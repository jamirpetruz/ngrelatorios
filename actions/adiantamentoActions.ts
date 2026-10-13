'use server'

import { findAdiantamentos } from "@/service/adiantamentos"
import { IAdiantamentoSalarial } from "@/types/Adiantamento"

export async function findAdiantamentosAction(empresa: string, dataLimite: string): Promise<IAdiantamentoSalarial[]>{
    const resultSQL = await findAdiantamentos(empresa, dataLimite)

    return resultSQL
}