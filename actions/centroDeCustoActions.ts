'use server'

import { findCentroDeCusto } from "@/service/rh/centroDeCusto";
import { ICentroDeCusto } from "@/types/CentroDeCusto";

export async function findCentroDeCustoAction(empresa: string, dataInicial: string, dataFinal: string): Promise<ICentroDeCusto[]>{
    const resultSQL = await findCentroDeCusto(empresa, dataInicial, dataFinal);
    return resultSQL
}