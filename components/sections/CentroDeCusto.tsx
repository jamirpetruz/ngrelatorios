"use client";

import { findAdiantamentosAction } from "@/actions/adiantamentoActions";
import { exportarExcelAction } from "@/actions/xlsxActions";
import { IAdiantamentoSalarial } from "@/types/Adiantamento";
import { useState } from "react";
import { Search } from "lucide-react";
import { Sheet } from "lucide-react";
import Loading from "../Loading";
import { findCentroDeCustoAction } from "@/actions/centroDeCustoActions";
import { ICentroDeCusto } from "@/types/CentroDeCusto";
import { CentroDeCustoTable } from "../tables/CentroDeCustoTable";
import * as XLSX from "xlsx";

export function exportarRelatorio(idContainer: string) {
    const container = document.getElementById(idContainer);
    if (!container) {
        console.error("Contêiner não encontrado.");
        return;
    }

    const tabelas = container.querySelectorAll("table");

    if (tabelas.length === 0) {
        console.error("Nenhuma tabela encontrada.");
        return;
    }

    const dados: string[][] = [];

    // Cabeçalhos da planilha
    const primeiraTabela = tabelas[0];
    const cabecalhos = Array.from(
        primeiraTabela.querySelectorAll("thead tr:last-child th")
    ).map((th) => th.textContent?.trim() ?? "");

    tabelas.forEach((tabela, index) => {
        // Título do departamento
        const departamento =
            tabela.querySelector("thead tr:first-child th")
                ?.textContent?.trim() ?? "";

        // Linha do departamento acima do cabeçalho
        dados.push([departamento]);

        // Cabeçalho das colunas
        dados.push(cabecalhos);

        // Linhas dos colaboradores e totalizadores
        const linhas = tabela.querySelectorAll("tbody tr");

        linhas.forEach((linha) => {
            const valores = Array.from(
                linha.querySelectorAll("td")
            ).map((td) => td.textContent?.trim() ?? "");

            dados.push(valores);
        });

        // Linha em branco entre departamentos
        if (index < tabelas.length - 1) {
            dados.push([]);
        }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dados);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Centro de Custo"
    );

    XLSX.writeFile(workbook, "relatorio-centro-de-custo.xlsx");
}

export default function CentroDeCustoSection() {
    const [dados, setDados] = useState<ICentroDeCusto[]>([])
    const [departamentos, setDepartamentos] = useState<string[]>([])
    const [listaPorDepartamento, setListaPorDepartamento] = useState<any[]>([])
    const [dataInicial, setDataInicial] = useState<string>('')
    const [dataFinal, setDataFinal] = useState<string>('')
    const [empresa, setEmpresa] = useState<string>('3487')
    const [detalhado, setDetalhado] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const formatarData = (data?: Date) => {
        if (!data) return "-";

        return new Date(data).toLocaleDateString("pt-BR");
    };

    const formatarValor = (valor?: number) => {
        if (valor === undefined || valor === null) return "-";

        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const getAdiantamentos = async () => {
        if (dataInicial.length <= 0 || empresa.length <= 0 || dataFinal.length <= 0) {
            alert('Selecione a empresa e as datas para consultar o relatório')
            return
        }
        setLoading(true)
        const result = await findCentroDeCustoAction(empresa, dataInicial, dataFinal)
        setDados(result)
        const d = result.map((item) => {
            return item.descricaodepartamento
        })
        const listaDepartamentos = Array.from(new Set(d))
        const listPorDepartamento = listaDepartamentos.map((d) => {
            let porDepartamento: { setor: string, lista: any[] } = {
                setor: d,
                lista: []
            };

            result.forEach((cc) => {
                if (cc.descricaodepartamento === d) {
                    porDepartamento.lista.push(cc);
                }
            });

            return porDepartamento;
        });
        setListaPorDepartamento(listPorDepartamento)
        setLoading(false)
    }

    const inputClass = 'text-sm border h-8 border-1 p-1 border-gray-500 rounded text-gray-800 dark:text-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:placeholder:text-gray-400 outline-none min-w-[180px]'
    return (
        <section className="w-max min-w-[1400px] table-auto text-left text-sm">
            {loading ? <Loading /> : null}
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b pb-2">
                <div className="w-full p-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Valores por centro de custo
                    </h2>

                    <p className="text-sm text-gray-500">
                        Lista de adiantamentos salariais
                    </p>
                    <div className="flex w-[100%] justify-between mt-1">
                        <div className="flex items-center gap-1">
                            <input
                                className={inputClass}
                                type="date"
                                name="dataInicial"
                                id="dataInicial"
                                onChange={(e) => setDataInicial(e.target.value)}
                            />
                            <input
                                className={inputClass}
                                type="date"
                                name="dataFinal"
                                id="dataFinal"
                                onChange={(e) => setDataFinal(e.target.value)}
                            />
                            <select className={inputClass} name="empresa" id="empresa" onChange={(e) => setEmpresa(e.target.value)}>
                                <option value="3487">BELA</option>
                                <option value="3488">PETRUZ</option>
                                <option value="3490">FORTALEZA</option>
                            </select>

                            <button className="p-2 text-white bg-olive-500 rounded cursor-pointer" onClick={getAdiantamentos}>
                                <Search size={16} />
                            </button>
                        <button className="p-2 bg-emerald-500 text-white rounded cursor-pointer" onClick={() => exportarRelatorio("relatorio-centro-custo")}>
                            <Sheet size={16} />
                        </button>
                        </div>
                    </div>
                    <label
                        htmlFor="detalhado"
                        className="inline-flex items-center gap-3 cursor-pointer select-none pt-2"
                    >
                        <input
                            type="checkbox"
                            name="detalhado"
                            id="detalhado"
                            checked={detalhado}
                            onChange={(e) => setDetalhado(e.target.checked)}
                            className="peer sr-only"
                        />

                        <div
                            className="relative h-5 w-9 rounded-full bg-gray-300 transition-colors duration-200
                                        peer-checked:bg-cyan-500
                                        peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-500 peer-focus-visible:ring-offset-2
                                        after:absolute after:left-0.5 after:top-0.5
                                        after:h-4 after:w-4 after:rounded-full after:bg-white
                                        after:shadow-sm after:transition-transform after:duration-200
                                        peer-checked:after:translate-x-4
                                        dark:bg-gray-600 dark:peer-checked:bg-cyan-500"
                        />

                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Detalhado
                        </span>
                    </label>
                </div>
            </div>

            {/* Tabela */}
            <div id="relatorio-centro-custo" className="flex-1 min-h-0 w-full overflow-auto">
                {
                    listaPorDepartamento.map((item, index) => (
                        <CentroDeCustoTable
                            key={index}
                            title={item.setor}
                            list={item.lista}
                            detalhado={detalhado}
                        />
                    ))
                }

            </div>
        </section>
    );
}