export interface IAdiantamentoSalarial {
  idowner: number;
  codigoregistro: string;
  Empresa: string;
  dataInicio?: Date;
  dataFim?: Date;
  idtipofatogeradorverba: number;
  descricaotipofatogeradorverba: string;
  idsubtipofatogeradorverba: number;
  descricaosubtipofatogeradorverba: string;
  Colaborador: string;
  Observacao: string | null;
  Vezes: string;
  valorParcela?: number;
  valorTotal?: number;
  Saldo?: number;
}