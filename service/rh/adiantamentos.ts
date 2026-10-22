import { getNGPool } from "@/lib/db";
import { IAdiantamentoSalarial } from "@/types/Adiantamento";

export async function findAdiantamentos(empresa: string, dataLimite: string): Promise<IAdiantamentoSalarial[]> {
    const pool = await getNGPool()
    const sql = `
        DECLARE @DATABUSCA DATE;
        SET @DATABUSCA = @dataLimite;
        SELECT
            T0.idowner,
            T0.codigoregistro,

            CASE
                WHEN T0.idowner = 3487 THEN 'BELA'
                WHEN T0.idowner = 3488 THEN 'PETRUZ'
                WHEN T0.idowner = 3490 THEN 'FORTALEZA'
            END AS Empresa,

            TF.datainiciofatogeradorverba AS [dataInicio],
            TF.datafimfatogeradorverba AS [dataFim],

            TF.idtipofatogeradorverba,
            T6.descricaotipofatogeradorverba,

            TF.idsubtipofatogeradorverba,
            T7.descricaosubtipofatogeradorverba,

            T4.nomepessoa AS Colaborador,
            TF.observacaofatogeradorverba AS Observacao,

            CAST(
                CASE
                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                        AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                            <= DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                        AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                            > DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1

                    ELSE 1
                END AS VARCHAR(20)
            )
            + '/'
            + CAST(
                DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                AS VARCHAR(20)
            ) AS Vezes,

            TF.valorfatogeradorverba AS [valorParcela],

            (DATEDIFF(
                MONTH,
                TF.datainiciofatogeradorverba,
                TF.datafimfatogeradorverba
            ) + 1) * TF.valorfatogeradorverba AS [valorTotal],

            CASE
                WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                    AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                        < DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                THEN
                    (
                        DATEDIFF(
                            MONTH,
                            TF.datainiciofatogeradorverba,
                            TF.datafimfatogeradorverba
                        ) + 1
                    ) * TF.valorfatogeradorverba
                    -
                    (
                        DATEDIFF(
                            MONTH,
                            TF.datainiciofatogeradorverba,
                            @DATABUSCA
                        ) + 1
                    ) * TF.valorfatogeradorverba

                WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                    AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                        = DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                THEN TF.valorfatogeradorverba

                WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 < 0
                THEN
                    (
                        DATEDIFF(
                            MONTH,
                            TF.datainiciofatogeradorverba,
                            TF.datafimfatogeradorverba
                        ) + 1
                    ) * TF.valorfatogeradorverba

                WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                    > DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                THEN 0

                ELSE NULL
            END AS Saldo

        FROM [NG_Folha].[dbo].[flh_fatogeradorverba] TF

        INNER JOIN [NG_Folha].[dbo].[flh_registro] T0
            ON T0.idregistro = TF.idregistro
            AND T0.datademissao IS NULL

        INNER JOIN [NG].[dbo].[bpm_pessoa] T4
            ON T0.idpessoaregistro = T4.idpessoa

        INNER JOIN [NG].[dbo].[bpm_dadospessoafisica] T5
            ON T5.idpessoa = T4.idpessoa

        INNER JOIN [NG_Folha].[dbo].[flh_tipofatogeradorverba] T6
            ON TF.idtipofatogeradorverba = T6.idtipofatogeradorverba

        INNER JOIN [NG_Folha].[dbo].[flh_subtipofatogeradorverba] T7
            ON TF.idsubtipofatogeradorverba = T7.idsubtipofatogeradorverba

        WHERE
            TF.idtipofatogeradorverba IN (164, 165)
            AND TF.idsubtipofatogeradorverba IN (169, 170, 174, 202)

            AND
            (
                CASE
                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                        AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                            < DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN
                        (
                            DATEDIFF(
                                MONTH,
                                TF.datainiciofatogeradorverba,
                                TF.datafimfatogeradorverba
                            ) + 1
                        ) * TF.valorfatogeradorverba
                        -
                        (
                            DATEDIFF(
                                MONTH,
                                TF.datainiciofatogeradorverba,
                                @DATABUSCA
                            ) + 1
                        ) * TF.valorfatogeradorverba

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                        AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                            = DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN TF.valorfatogeradorverba

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 < 0
                    THEN
                        (
                            DATEDIFF(
                                MONTH,
                                TF.datainiciofatogeradorverba,
                                TF.datafimfatogeradorverba
                            ) + 1
                        ) * TF.valorfatogeradorverba

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                        > DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN 0

                    ELSE NULL
                END <> 0

                OR

                CASE
                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                        AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                            < DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN 1

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 > 0
                        AND DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                            = DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN 1

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1 < 0
                    THEN 1

                    WHEN DATEDIFF(MONTH, TF.datainiciofatogeradorverba, @DATABUSCA) + 1
                        > DATEDIFF(MONTH, TF.datainiciofatogeradorverba, TF.datafimfatogeradorverba) + 1
                    THEN 1

                    ELSE NULL
                END IS NULL
            )
            AND T0.idowner = @empresa
        ORDER BY
            T0.idowner,
            T4.nomepessoa;
        `;
    try {
        const result = await pool
            .request()
            .input('empresa', empresa)
            .input('dataLimite', dataLimite)
            .query(sql)
        return result.recordset as IAdiantamentoSalarial[]
    } catch (error) {
        console.log(error)
        return []
    } finally {
        await pool.close()
    }
}