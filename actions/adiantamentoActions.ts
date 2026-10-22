'use server'

import { findAdiantamentos } from "@/service/rh/adiantamentos"
import { findCentroDeCusto } from "@/service/rh/centroDeCusto"
import { IAdiantamentoSalarial } from "@/types/Adiantamento"

export async function findAdiantamentosAction(empresa: string, dataLimite: string): Promise<IAdiantamentoSalarial[]>{
    const resultSQL = await findAdiantamentos(empresa, dataLimite)
    await findCentroDeCusto('3487', '2026-09-01', '2026-09-30');
    return resultSQL
}