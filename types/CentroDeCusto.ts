export interface ICentroDeCusto {
  idowner: number;
  codigoregistro: string;
  nomepessoa: string;
  idverba: number;
  descricaoverba: string;
  valorcalculado: number;
  CLT: number | null;
  SALARIO: number | null;
  SALARIO2: number | null;
  "SALARIO JA": number | null;
  "SALARIO NO": number | null;
  OUTROS: number | null;
  "OUTROS JA": number | null;
  "OUTROS NO": number | null;
  TRANSPORT: number | null;
  Empresa: string;
  descricaodepartamento: string;
  idtipocontratacao: number;
  CARGO: string;
}