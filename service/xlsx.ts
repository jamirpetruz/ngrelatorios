import * as XLSX from "xlsx";

export function exportarExcel(lines: any[], sheetName: string) {
    const worksheet = XLSX.utils.aoa_to_sheet([[]]);

    XLSX.utils.sheet_add_json(worksheet, lines, {
        skipHeader: Array.isArray(lines[0]) // arrays: sem a linha 0,1,2...
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha1");

    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
}