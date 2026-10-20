"use client";

import { findAdiantamentosAction } from "@/actions/adiantamentoActions";
import { exportarExcelAction } from "@/actions/xlsxActions";
import { IAdiantamentoSalarial } from "@/types/Adiantamento";
import { useState } from "react";
import { Search } from "lucide-react";
import { Sheet } from "lucide-react";
import Loading from "../Loading";

export interface AdiantamentoDTO {
    Empresa: string;
    Colaborador: string;
    dataInicio?: Date;
    dataFim?: Date;
    idtipofatogeradorverba: number;
    descricaotipofatogeradorverba: string;
    idsubtipofatogeradorverba: number;
    descricaosubtipofatogeradorverba: string;
    Vezes: string;
    valorParcela?: number;
    valorTotal?: number;
    Saldo?: number;
    Observacao: string | null;
}

export default function AdiantamentosSection() {
    const [dados, setDados] = useState<IAdiantamentoSalarial[]>([])
    const [dataLimite, setDataLimite] = useState<string>('')
    const [empresa, setEmpresa] = useState<string>('3487')
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
        if (dataLimite.length <= 0 || empresa.length <= 0) {
            alert('Selecione a empresa e a data limite para buscar os adiantamentos')
            return
        }
        setLoading(true)
        const result = await findAdiantamentosAction(empresa, dataLimite)
        setDados(result)
        setLoading(false)
    }
    const getExcel = () => {
        const dadosDTO = dados.map((item) => ({
            Empresa: item.Empresa,
            Colaborador: item.Colaborador,
            Tipo: item.descricaotipofatogeradorverba,
            Subtipo: item.descricaosubtipofatogeradorverba,
            dataInicio: item.dataInicio,
            dataFim: item.dataFim,
            Vezes: item.Vezes,
            valorParcela: item.valorParcela,
            valorTotal: item.valorTotal,
            Saldo: item.Saldo,
            Observacao: item.Observacao,
        }));
        exportarExcelAction(dadosDTO, 'Adiantamentos')
    }
    const inputClass = 'text-sm border h-8 border-1 p-1 border-gray-500 rounded text-gray-800 dark:text-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:placeholder:text-gray-400 outline-none min-w-[180px]'
    return (
        <section className="w-full h-full min-h-0 flex flex-col rounded-lg overflow-hidden">
            {loading ? <Loading/> : null}
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b pb-2">
                <div className="w-full p-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Adiantamentos Salariais
                        <span className="ml-2 rounded-full bg-green-300 px-3 py-1 text-sm text-gray-800">
                            {dados.length} registro{dados.length !== 1 ? "s" : ""}
                        </span>
                    </h2>

                    <p className="text-sm text-gray-500">
                        Lista de adiantamentos salariais
                    </p>
                    <div className="flex w-[100%] justify-between mt-1">
                        <div className="flex items-end gap-1">
                            <input
                                className={inputClass}
                                type="date"
                                name="dataLimite"
                                id="dataLimite"
                                onChange={(e) => setDataLimite(e.target.value)}
                            />
                            <select className={inputClass} name="empresa" id="empresa" onChange={(e) => setEmpresa(e.target.value)}>
                                <option value="3487">BELA</option>
                                <option value="3488">PETRUZ</option>
                                <option value="3490">FORTALEZA</option>
                            </select>
                            <button className="p-2 text-white bg-olive-500 rounded cursor-pointer" onClick={getAdiantamentos}>
                                <Search size={16} />
                            </button>
                        </div>
                        <button className="p-2 bg-emerald-500 text-white rounded cursor-pointer" onClick={getExcel}>
                            <Sheet size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="flex-1 min-h-0 w-full overflow-auto">
                <table className="w-full min-w-[1400px] text-left text-sm">
                    <thead className="sticky top-0 z-10 dark:bg-gray-700 text-xs uppercase text-gray-600">
                        <tr className="dark:text-gray-300">
                            <th className="whitespace-nowrap px-4 py-3">
                                Empresa
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                Colaborador
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                Tipo
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                Subtipo
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                Data início
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                Data fim
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-center">
                                Parcelas
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right">
                                Valor parcela
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right">
                                Valor total
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right">
                                Saldo
                            </th>

                            <th className="whitespace-nowrap truncate px-4 py-3">
                                Observação
                            </th>
                        </tr>
                    </thead>

                    <tbody className="">
                        {dados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="px-6 py-10 text-center text-gray-500"
                                >
                                    Nenhum adiantamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            dados.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 odd:bg-white even:bg-gray-200 dark:text-white dark:even:bg-gray-700 dark:odd:bg-gray-600 text-xs"
                                >
                                    <td className="whitespace-nowrap px-4 py-2 font-medium ">
                                        {item.Empresa}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.Colaborador}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.descricaotipofatogeradorverba}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.descricaosubtipofatogeradorverba}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {formatarData(item.dataInicio)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {formatarData(item.dataFim)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        {item.Vezes}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-right">
                                        {formatarValor(item.valorParcela)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-right font-medium">
                                        {formatarValor(item.valorTotal)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-right font-medium">
                                        {formatarValor(item.Saldo)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.Observacao || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}