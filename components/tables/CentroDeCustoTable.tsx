'use client'

import { ICentroDeCusto } from "@/types/CentroDeCusto"
import { calcular13, calcularFerias, calcularFGTS, calcularINSS, calcularOutros, calcularTotal, calcularTotalCLT, calcularTransport } from "@/utils/rh/centroDeCusto"
import { ArrowBigRight } from "lucide-react"
import { Fragment, useEffect, useState } from "react"


interface CentroDeCustoTableProps {
    list: ICentroDeCusto[]
    title: string
    detalhado: boolean
}

interface IPorColaborador {
    colaborador: string;
    cargo: string;
    salario: number;
    outros: number;
    transport: number;
    decimo13: number;
    ferias: number;
    adicFerias: number;
    inss: number;
    fgts: number;
    total: number;
    totalCLT: number
}

interface ILinhaTotais {
    outrosRend: number
    decimo13: number
    ferias: number
    adicFerias: number
    inss: number
    fgts: number
    transport: number
}

function formatBRL(valor: number | null): string {
    return valor ? 'R$ ' + valor.toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : ''
}

export function CentroDeCustoTable(props: CentroDeCustoTableProps) {
    const [porColaborador, setPorColaborador] = useState<IPorColaborador[]>([])

    useEffect(() => {
        const nomes = props.list.map((item) => item.nomepessoa);
        const colaboradores = Array.from(new Set(nomes));

        const resultado: IPorColaborador[] = colaboradores.map((colaborador) => {
            const valoresC = props.list.filter(
                (l) => l.nomepessoa === colaborador
            );

            const decimo13 = calcular13(valoresC);
            const ferias = calcularFerias(valoresC);
            const adicFerias = ferias / 3;

            const inss = calcularINSS(
                valoresC,
                decimo13,
                adicFerias,
                ferias
            );

            const fgts = calcularFGTS(
                valoresC,
                decimo13,
                adicFerias,
                ferias
            );

            const total = calcularTotal(
                valoresC,
                decimo13,
                ferias,
                adicFerias,
                inss,
                fgts
            );
            const totalCLT = calcularTotalCLT(valoresC)
            const outros = calcularOutros(valoresC)
            const transport = calcularTransport(valoresC)
            return {
                colaborador: colaborador,
                cargo: valoresC[0].CARGO,
                salario: valoresC[0].SALARIO2!!,
                outros: outros,
                transport: transport,
                decimo13: decimo13,
                ferias: ferias,
                adicFerias: adicFerias,
                inss: inss,
                fgts: fgts,
                total: total,
                totalCLT: totalCLT
            };
        });

        setPorColaborador(resultado);
    }, [props.list]);
    const linhaTotais = porColaborador.reduce(
        (totais, item) => ({
            decimo13: totais.decimo13 + item.decimo13,
            adicFerias: totais.adicFerias + item.adicFerias,
            ferias: totais.ferias + item.ferias,
            fgts: totais.fgts + item.fgts,
            inss: totais.inss + item.inss,
            outrosRend: totais.outrosRend + item.outros,
            transport: totais.transport + item.transport,
            totalTotais: item.total + totais.totalTotais,
            totalCLT: item.totalCLT + totais.totalCLT
        }),
        {
            decimo13: 0,
            adicFerias: 0,
            ferias: 0,
            fgts: 0,
            inss: 0,
            outrosRend: 0,
            transport: 0,
            totalTotais: 0,
            totalCLT: 0
        }
    );
    return (
        <>
            <table className="w-full min-w-[1400px] text-left text-xs">
                <thead className="top-0 z-10 dark:bg-gray-700 text-xs uppercase text-gray-600">
                    <tr className="dark:text-gray-300 dark:bg-gray-500">
                        <th className="text-sm pl-1">
                            {props.title}
                        </th>
                    </tr>
                    <tr className="dark:text-gray-300 bg-gray-200 dark:bg-gray-700">
                        <th className="whitespace-nowrap pl-2 w-[300px]">Nome</th>
                        <th className="whitespace-nowrap">Cargo</th>
                        <th className="whitespace-nowrap">Salário</th>
                        <th className="whitespace-nowrap">Outros Rendim.</th>
                        <th className="whitespace-nowrap">13º Salário</th>
                        <th className="whitespace-nowrap">Férias</th>
                        <th className="whitespace-nowrap">Adic. Férias</th>
                        <th className="whitespace-nowrap">INSS Emp.</th>
                        <th className="whitespace-nowrap">FGTS</th>
                        <th className="whitespace-nowrap">Vale Transp.</th>
                        <th className="whitespace-nowrap">Desconto CLT</th>
                        <th className="whitespace-nowrap">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {porColaborador.map((item, index) => {
                        return (
                            <Fragment key={item.colaborador}>
                                <tr key={index}>
                                    <td className="flex items-center whitespace-nowrap py-2 pl-2">{item.colaborador}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{item.cargo}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.salario)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.outros)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.decimo13)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.ferias)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.adicFerias)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.inss)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.fgts)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.transport)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.totalCLT)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">{formatBRL(item.total)}</td>
                                </tr>
                                {props.list
                                    .filter((subItem) => subItem.nomepessoa === item.colaborador)
                                    .map((subItem, subIndex) => {
                                        if (props.detalhado) {
                                            return (
                                                <tr className="text-[9pt]" key={subIndex}>
                                                    <td className="whitespace-nowrap pl-2 dark:bg-gray-900 border-b border-gray-500">
                                                        {subItem.idverba}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 dark:bg-gray-900 border-b border-gray-500">
                                                        {subItem.descricaoverba}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 dark:bg-gray-900 border-b border-gray-500">
                                                        {formatBRL(subItem.valorcalculado)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 dark:bg-gray-900 border-b border-gray-500">
                                                        {formatBRL(subItem.OUTROS)}
                                                    </td>

                                                    {Array.from({ length: 9 }).map((_, index) => (
                                                        <td key={index} className="whitespace-nowrap px-4 dark:bg-gray-900" />
                                                    ))}
                                                </tr>
                                            )
                                        }
                                    }
                                    )}
                            </Fragment>
                        )
                    })

                    }
                    <tr className="border-t border-gray-500 bg-gray-200 dark:bg-gray-700">
                        <td className="whitespace-nowrap py-2 pl-2">CONTAGEM {porColaborador.length}</td>
                        <td className="whitespace-nowrap px-4 py-2"></td>
                        <td className="whitespace-nowrap px-4 py-2"></td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.outrosRend)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.decimo13)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.ferias)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.adicFerias)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.inss)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.fgts)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.transport)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.totalCLT)}</td>
                        <td className="whitespace-nowrap px-4 py-2">{formatBRL(linhaTotais.totalTotais)}</td>
                    </tr>
                </tbody>
            </table >
        </>
    )
}