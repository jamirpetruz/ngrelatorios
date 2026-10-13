import { exportarExcel } from "@/service/xlsx";

export async function exportarExcelAction(dados: any, sheetName: string){
    exportarExcel(dados, sheetName)
}