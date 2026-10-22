import { ICentroDeCusto } from "@/types/CentroDeCusto"

export function calcularTransport(dados: ICentroDeCusto[]): number{
    let totalTransport = 0
    dados.forEach((item) => {
        totalTransport += item.TRANSPORT || 0
    })
    return totalTransport
}
export function calcularTotalCLT(dados: ICentroDeCusto[]): number{
    let totalCLT = 0
    dados.forEach((item) => {
        totalCLT += item.CLT || 0
    })
    return totalCLT
}
export function calcularOutros(dados: ICentroDeCusto[]): number{
    let totalOutros = 0
    dados.forEach((item) => {
        totalOutros += item.OUTROS || 0
    })
    return totalOutros
}

export function calcular13(
    dados: ICentroDeCusto[]
): number {
    let totalOutros = 0
    let totalSalario = 0
    dados.forEach((item) => {
        totalOutros += item.OUTROS || 0
        totalSalario += item.SALARIO || 0
    })
    return (totalOutros + totalSalario) / 12
}

export function calcularFerias(
    dados: ICentroDeCusto[]
): number {
    let totalOutros = 0
    let totalSalario = 0
    dados.forEach((item) => {
        totalOutros += item.OUTROS || 0
        totalSalario += item.SALARIO || 0
    })
    return (totalOutros + totalSalario) / 12
}

export function calcularINSS(
    dados: ICentroDeCusto[],
    decimoTerceiro: number,
    adicFerias: number,
    ferias: number
): number {
    const totalOutros = dados.reduce(
        (soma, item) => soma + (Number(item.OUTROS) || 0),
        0
    );

    const totalSalario = dados.reduce(
        (soma, item) => soma + (Number(item.SALARIO) || 0),
        0
    );

    return (
        (
            totalOutros +
            totalSalario +
            decimoTerceiro +
            adicFerias +
            ferias
        ) * 5.8
    ) / 100;
}

export function calcularFGTS(
    dados: ICentroDeCusto[],
    decimoTerceiro: number,
    adicFerias: number,
    ferias: number
): number {
    if (dados.length === 0) return 0;

    const totalOutros = dados.reduce(
        (soma, item) => soma + (Number(item.OUTROS) || 0),
        0
    );

    const totalSalario = dados.reduce(
        (soma, item) => soma + (Number(item.SALARIO) || 0),
        0
    );

    const base =
        totalOutros +
        totalSalario +
        decimoTerceiro +
        adicFerias +
        ferias;

    const percentual =
        dados[0].idtipocontratacao === 3 ? 2 : 8;

    return (base * percentual) / 100;
}

export function calcularTotal(
    dados: ICentroDeCusto[],
    decimoTerceiro: number,
    ferias: number,
    adicFerias: number,
    inss: number,
    fgts: number
): number {
    const soma = (campo: keyof ICentroDeCusto) =>
        dados.reduce(
            (total, item) => total + (Number(item[campo]) || 0),
            0
        );

    return (
        soma("OUTROS") +
        soma("SALARIO") +
        decimoTerceiro +
        ferias +
        adicFerias +
        inss +
        fgts +
        soma("TRANSPORT") -
        soma("CLT")
    );
}