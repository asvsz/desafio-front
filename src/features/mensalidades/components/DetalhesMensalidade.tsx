'use client';

interface Mensalidade {
  id_mensalidade: number;
  parcela: number | string;
  data_emissao: string;
  vencimento: string;
  cobranca: string;
  data_pgto?: string | null;
  hora_pgto?: string | null;
  valor_principal: number | string;
  valor_pago?: number | string | null; 
  status: 'A' | 'P';
  referencia: string;
  form_pagto?: string | null; 
}

interface DetalhesMensalidadeProps {
  mensalidade: Mensalidade;
}

const DetalhesMensalidade = ({ mensalidade }: DetalhesMensalidadeProps) => {
  const formatarData = (data: string | null | undefined) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor: number | string | null | undefined) => {
    if (valor === null || valor === undefined) return '-';
    return `R$ ${Number(valor).toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className={`mt-1 text-lg font-semibold ${mensalidade.status === 'P' ? 'text-green-600' : 'text-red-600'}`}>
            {mensalidade.status === 'P' ? 'Pago' : 'Aberto'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Parcela</h3>
          <p className="mt-1 text-lg font-semibold">{mensalidade.parcela}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Referência</h3>
          <p className="mt-1 text-lg font-semibold">{mensalidade.referencia}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Valor Principal</h3>
          <p className="mt-1 text-base font-semibold text-gray-800">{formatarValor(mensalidade.valor_principal)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Valor Pago</h3>
          <p className="mt-1 text-base text-gray-800">{formatarValor(mensalidade.valor_pago)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Data de Emissão</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(mensalidade.data_emissao)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Vencimento</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(mensalidade.vencimento)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Data de Pagamento</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(mensalidade.data_pgto)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Hora do Pagamento</h3>
          <p className="mt-1 text-base text-gray-800">{mensalidade.hora_pgto || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Forma de Pagamento</h3>
          <p className="mt-1 text-base text-gray-800">{mensalidade.form_pagto || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Cobrança</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(mensalidade.cobranca)}</p>
        </div>
      </div>
    </div>
  );
};

export default DetalhesMensalidade;