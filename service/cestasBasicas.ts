import { getNGPool } from "@/lib/db";
import { ICestaBasica } from "@/types/CestaBasica";
import { ICestaBasicaNovo } from "@/types/CestaBasicaNovo";

export async function findCestasBasicas(empresa: string, mes: string): Promise<ICestaBasica[]> {
    const pool = await getNGPool()
    const sql = `
        SELECT
            T0.codigoregistro,
            T4.nomepessoa AS nome,
            T5.cpf,

            SUM(
                CASE
                    WHEN T2.valorinformado > T2.valorcalculado
                        THEN T2.valorinformado * 10
                    ELSE T2.valorcalculado * 10
                END
            ) AS valor,

            SUM(
                CASE
                    WHEN T2.valorinformado > T2.valorcalculado
                        THEN T2.valorinformado
                    ELSE T2.valorcalculado
                END
            ) AS ValorDesconto,

            T1.datainiciofolha,
            T1.datafimfolha,
            T5.datanascimento AS dataNascimento,
            T5.indsexo AS sexo,
            T0.idowner

        FROM [NG_FOLHA]..flh_registro T0

        INNER JOIN [NG_FOLHA]..flh_folhapay T1
            ON T0.idregistro = T1.idregistro

        INNER JOIN [NG_FOLHA]..flh_folhapayverba T2
            ON T1.idpay = T2.idpay

        INNER JOIN [NG]..bpm_pessoa T4
            ON T0.idpessoaregistro = T4.idpessoa

        INNER JOIN [NG]..bpm_dadospessoafisica T5
            ON T5.idpessoa = T4.idpessoa

        WHERE
            T2.idverba IN (22, 33)
            AND MONTH(T1.datainiciofolha) = @mes_ano
            AND YEAR(T1.datainiciofolha) = YEAR(GETDATE())
            AND T0.idowner = @empresa

        GROUP BY
            T0.codigoregistro,
            T4.nomepessoa,
            T5.cpf,
            T1.datainiciofolha,
            T1.datafimfolha,
            T5.datanascimento,
            T5.indsexo,
            T0.idowner

        ORDER BY
            T4.nomepessoa;
        `;
    const result = await pool
        .request()
        .input('empresa', empresa)
        .input('mes_ano', mes)
        .query(sql)
    return result.recordset as ICestaBasica[]
}

export async function findCestasBasicasNovo(empresa: string, mes: string): Promise<ICestaBasicaNovo[]> {
    const pool = await getNGPool()
    const sql = `
        WITH verbas AS (
            SELECT
                T0.idregistro,
                T0.codigoregistro,
                T0.idpessoaregistro,
                T0.idowner,
                MIN(T1.datainiciofolha) AS datainiciofolha,
                MAX(T1.datafimfolha)    AS datafimfolha,
                SUM(CASE WHEN T2.valorinformado > T2.valorcalculado
                        THEN T2.valorinformado ELSE T2.valorcalculado END) AS ValorDesconto
            FROM [NG_FOLHA]..flh_registro T0
                INNER JOIN [NG_FOLHA]..flh_folhapay      T1 ON T0.idregistro = T1.idregistro
                INNER JOIN [NG_FOLHA]..flh_folhapayverba T2 ON T1.idpay = T2.idpay
            WHERE T2.idverba IN (22, 33)
            AND MONTH(T1.datainiciofolha) = @mes_ano
            AND YEAR(T1.datainiciofolha)  = YEAR(GETDATE())
            AND T0.idowner = @empresa
            GROUP BY T0.idregistro, T0.codigoregistro, T0.idpessoaregistro, T0.idowner
        )
        SELECT
            V.codigoregistro,
            T4.nomepessoa        AS nome,
            T5.cpf,
            V.ValorDesconto * 10 AS valor,
            V.ValorDesconto,
            V.datainiciofolha,
            V.datafimfolha,
            T5.datanascimento    AS dataNascimento,
            T5.indsexo           AS sexo,
            V.idowner,
            T8.nomepessoa        AS mae,

            [email] = (SELECT TOP 1 T6.descricaotipocontato
                    FROM [NG].[dbo].[bpm_pessoatipocontato] T6
                    WHERE T6.idpessoa = T4.idpessoa AND T6.idtipocontato = 3),

            [telefone] = STUFF((SELECT ', ' + T6.descricaotipocontato
                                FROM [NG].[dbo].[bpm_pessoatipocontato] T6
                                WHERE T6.idpessoa = T4.idpessoa AND T6.idtipocontato IN (1, 2, 5, 6, 7)
                                FOR XML PATH('')), 1, 2, '')

        FROM verbas V
            INNER JOIN [NG]..[bpm_pessoa]              T4 ON V.idpessoaregistro = T4.idpessoa
            INNER JOIN [NG]..[bpm_dadospessoafisica]   T5 ON T5.idpessoa = T4.idpessoa
            INNER JOIN [NG]..[bpm_pessoarelacionamento] T7 ON T7.idpessoasecundaria = V.idpessoaregistro
                                                        AND T7.idtiporelacionamentopessoa = 3
            LEFT  JOIN [NG]..[bpm_pessoa]              T8 ON T7.idpessoaprincipal = T8.idpessoa
        ORDER BY T4.nomepessoa;
        `;
    const result = await pool
        .request()
        .input('empresa', empresa)
        .input('mes_ano', mes)
        .query(sql)
    return result.recordset as ICestaBasicaNovo[]
}