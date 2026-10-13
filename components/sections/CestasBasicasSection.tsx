"use client";

import { findAdiantamentosAction } from "@/actions/adiantamentoActions";
import { findCestasBasicasAction } from "@/actions/cestaBasicaActions";
import { exportarExcelAction } from "@/actions/xlsxActions";
import { IAdiantamentoSalarial } from "@/types/Adiantamento";
import { ICestaBasica } from "@/types/CestaBasica";
import { useState } from "react";
import { Search } from "lucide-react";
import { Sheet } from "lucide-react";

export interface CestasBasicasDTO {
    nome: string
    cpf: string
    dataNascimento: string
    sexo: string
    valor: number
    tipoLocalEntrega: string
    localEntrega: string
    matricula: string
}

export default function CestasBasicasSection() {
    const [dados, setDados] = useState<ICestaBasica[]>([])
    const [mes, setMes] = useState<string>('1')
    const [empresa, setEmpresa] = useState<string>('3487')
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

    const getCestasBasicas = async () => {
        if (mes.length <= 0 || empresa.length <= 0) {
            alert('Selecione a empresa e o mês para buscar as cestas básicas')
            return
        }
        const result = await findCestasBasicasAction(mes, empresa)
        console.log(result)
        setDados(result)
    }
    const getExcel = () => {
        let contrato = ''

        switch (dados[0]?.idowner) {
            case 3487:
                contrato = "23517518";
                break;

            case 3488:
                contrato = "23519418";
                break;

            case 3490:
                contrato = "13113720";
                break;
        }
        const dadosExcel = [
            ["", "CONTRATO"],
            ["%", contrato, "%"],
            [
                "",
                "NOME DO USUARIO",
                "CPF",
                "DATA DE NASCIMENTO",
                "CODIGO DE SEXO",
                "VALOR",
                "TIPO DE LOCAL DE ENTREGA",
                "LOCAL DE ENTREGA",
                "MATRICULA",
                "%"
            ],
            ...dados.map((item) => [
                "%",
                item.nome,
                item.cpf,
                item.dataNascimento,
                item.sexo,
                item.valor,
                "FI",
                item.idowner === 3487
                    ? "181"
                    : item.idowner === 3488
                        ? "108"
                        : "-",
                item.matricula,
                "%"
            ])
        ];
        console.log(dadosExcel)
        exportarExcelAction(
            dadosExcel,
            "Relatório Verbas Cestas Básicas"
        );
    }
    const inputClass = 'text-sm border h-8 border-1 p-1 border-gray-500 rounded text-gray-800 dark:text-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:placeholder:text-gray-400 outline-none min-w-[180px]'
    return (
        <section className="w-full rounded-lg">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b pb-2">
                <div className="w-full">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Relatório Verbas Cestas Básicas
                        <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-sm text-gray-600">
                            {dados.length} registro{dados.length !== 1 ? "s" : ""}
                        </span>
                    </h2>

                    <p className="text-sm text-gray-500">
                        Lista de cestas básicas
                    </p>
                    <div className="flex w-[100%] justify-between mt-1 flex-wrap ">
                        <div className="flex items-end gap-1">
                            <select className={inputClass} name="mes" id="mes" onChange={(e) => setMes(e.target.value)}>
                                <option value="1">JANEIRO</option>
                                <option value="2">FEVEREIRO</option>
                                <option value="3">MARÇO</option>
                                <option value="4">ABRIL</option>
                                <option value="5">MAIO</option>
                                <option value="6">JUNHO</option>
                                <option value="7">JULHO</option>
                                <option value="8">AGOSTO</option>
                                <option value="9">SETEMBRO</option>
                                <option value="10">OUTUBRO</option>
                                <option value="11">NOVEMBRO</option>
                                <option value="12">DEZEMBRO</option>
                            </select>
                            <select className={inputClass} name="empresa" id="empresa" onChange={(e) => setEmpresa(e.target.value)}>
                                <option value="3487">BELA</option>
                                <option value="3488">PETRUZ</option>
                            </select>
                            <button className="p-2 text-white bg-olive-500 rounded cursor-pointer" onClick={getCestasBasicas}>
                                <Search size={16} />
                            </button>
                        </div>
                        <button className="p-2 text-white bg-emerald-500 rounded cursor-pointer" onClick={getExcel}>
                            <Sheet size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="w-full overflow-x-auto max-h-[65vh] overflow-y-auto">
                <table className="w-full min-w-[1400px] text-left text-sm">
                    <thead className="sticky top-0 z-10 border-b bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-600">
                        <tr className="dark:text-gray-300">
                            <th className="whitespace-nowrap px-4 py-3">
                                NOME DO USUÁRIO
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                CPF
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                DATA DE NASCIMENTO
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                CÓDIGO DE SEXO
                            </th>

                            <th className="whitespace-nowrap px-4 py-3">
                                VALOR
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-center">
                                TIPO DE LOCAL DE ENTREGA
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-center">
                                LOCAL DE ENTREGA
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 text-right">
                                MATRÍCULA
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
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
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.nome}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-mono">
                                        {item.cpf}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.dataNascimento ? new Date(item.dataNascimento).toLocaleDateString("pt-BR") : "-"}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.sexo}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2">
                                        {item.valor}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        FI
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        {item.idowner === 3487 ? '181' : item.idowner === 3488 ? '108' : '-'}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-right">
                                        {item.matricula}
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