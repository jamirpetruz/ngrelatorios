import { getNGPool } from "@/lib/db";
import { IAdiantamentoSalarial } from "@/types/Adiantamento";
import { ICentroDeCusto } from "@/types/CentroDeCusto";

export async function findCentroDeCusto(empresa: string, dataInicial: string, dataFinal: string): Promise<ICentroDeCusto[]>{
    const pool = await getNGPool()
    const sql = `
    DECLARE  @DataIni DATE, @DataFim DATE, @DataFim2 DATE
    SET @DataIni = CONVERT(DATETIME,CAST(DAY(@DataInicial) AS VARCHAR)+'/'+CAST(MONTH(@DataInicial) AS VARCHAR)+'/'+CAST(YEAR(@DataInicial) AS VARCHAR),103)
    SET @DataFim = CONVERT(DATETIME,CAST(DAY(@DataFinal) AS VARCHAR)+'/'+CAST(MONTH(@DataFinal) AS VARCHAR)+'/'+CAST(YEAR(@DataFinal) AS VARCHAR),103)
    SET @DataFim2 = CONVERT(DATETIME,'01/'+CAST(MONTH(@DataFinal) AS VARCHAR)+'/'+CAST(YEAR(@DataFinal) AS VARCHAR),103)

    SELECT T0.idowner,
    T0.codigoregistro,
    T4.nomepessoa,
    T2.idverba,
    T3.[descricaoverba],
    valorcalculado = CASE WHEN T2.idverba = 80 THEN CASE WHEN T2.valorinformado > 0 THEN T2.valorinformado ELSE T2.valorcalculado END ELSE T2.valorcalculado END,
    [CLT] = CASE WHEN T2.idverba = 80 THEN CASE WHEN T2.valorinformado > 0 THEN T2.valorinformado ELSE T2.valorcalculado END END,
    [SALARIO] = CASE WHEN T2.idverba = -2 THEN T2.valorcalculado END,
    [SALARIO2]= (
            SELECT MAX(IT18.salario)
            FROM [ng_folha].[dbo].[flh_movimentosalario] IT18
                INNER JOIN [NG_FOLHA]..[flh_registro] T6 ON T0.[idregistro] = T6.[idregistro]
            WHERE IT18.[idregistro] = T6.[idregistro]
        ),
    [SALARIO JA] = CASE WHEN T0.idtipocontratacao = 3 THEN CASE WHEN T2.idverba = -2 THEN T2.valorcalculado END ELSE 0 END,
    [SALARIO NO] = CASE WHEN T0.idtipocontratacao <> 3 THEN CASE WHEN T2.idverba = -2 THEN T2.valorcalculado END ELSE 0 END,
    [OUTROS] = CASE WHEN T2.idverba IN (78,-99,-62,-66,-63,-72,13,70,59,-64,-69,-238,-70,48,12,14,47,60,-54,-52,-58,-65,40,37,38) AND T2.[indprovdesc] > 0 THEN T2.valorcalculado END,
    [OUTROS JA] = CASE WHEN T0.idtipocontratacao = 3 THEN CASE WHEN T2.idverba IN (78,-99,-62,-63,-72,13,70,59,-64,-69,-238,-70,48,12,14,47,60,-54,-52,-58,-65,40,37,38) AND T2.[indprovdesc] > 0 THEN T2.valorcalculado END ELSE 0 END,
    [OUTROS NO] = CASE WHEN T0.idtipocontratacao <> 3 THEN CASE WHEN T2.idverba IN (78,-99,-62,-66,-63,-72,13,70,59,-64,-69,-238,-70,48,12,14,47,60,-54,-52,-58,-65,40,37,38) AND T2.[indprovdesc] > 0 THEN T2.valorcalculado END ELSE 0 END,
    [TRANSPORT] = CASE WHEN T2.idverba = -47 THEN 259.2 - T2.valorcalculado END,
    [Empresa] =
    CASE
    WHEN T0.idowner = 3487 THEN 'BELA' 
    WHEN T0.idowner = 3488 THEN 'PETRUZ'
    WHEN T0.idowner = 3490 THEN 'FORTALEZA'
    END,
    T13.[descricaodepartamento], T0.idtipocontratacao,
    [CARGO] = T11.descricaocargo --T11.codigocargo+' - '+T11.descricaocargo

    FROM [NG_FOLHA]..flh_registro T0
    INNER JOIN [NG_FOLHA]..flh_folhapay T1 on T0.idregistro = T1.idregistro
    INNER JOIN [NG_FOLHA]..flh_folhapayverba T2 on T1.idpay = T2.idpay
    INNER JOIN [NG_FOLHA]..[flh_verba] T3 ON T2.idverba = T3.idverba
    INNER JOIN [NG]..[bpm_pessoa] T4 ON T0.idpessoaregistro = T4.idpessoa
    INNER JOIN [NG]..[bpm_dadospessoafisica] T5 ON T5.idpessoa = T4.idpessoa
    INNER JOIN [NG_FOLHA]..[flh_movimentodepartamento] T12 ON T1.idregistro = T12.idregistro AND T12.datafim IS NULL
    INNER JOIN [NG_RH]..[rh_departamento] T13 ON T13.iddepartamento = T12.iddepartamento
    INNER JOIN [NG_FOLHA]..[flh_movimentocargo] T10 ON T0.idregistro = T10.idregistro AND T10.datafim IS NULL
    INNER JOIN [NG_FOLHA]..[flh_cargo] T11 ON T10.idcargo = T11.idcargo

    WHERE
    --T0.idpessoaregistro = 3526--5232
    --T0.codigoregistro IN (10, 154, 487, 62) AND
    --T1.datainiciofolha >= @DataIni AND T1.datafimfolha <= @DataFim
    T1.datainiciofolha BETWEEN @DataIni AND @DataFim2
    --AND T2.[indprovdesc] > 0
    --T1.IDPAY IN (34206,34640)
    AND T2.idverba NOT IN (-18, -19)
    AND T0.idowner = @empresa
    --AND T0.idregistro IN (262, 101)
    `;
    try {
        const result = await pool
            .request()
            .input('empresa', empresa)
            .input('DataInicial', dataInicial)
            .input('DataFinal', dataFinal)
            .query(sql)
        return result.recordset as ICentroDeCusto[]
    } catch (error) {
        console.log(error)
        return []
    } finally {
        await pool.close()
    }
}