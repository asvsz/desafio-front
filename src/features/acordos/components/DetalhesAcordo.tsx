'use client'
interface Mensalidade {
  id_mensalidade: number;
  parcela: number;
  referencia: string;
  valor_principal: number | string;
  status: 'A' | 'P';
}

interface AcordoMensalidade {
  mensalidade: Mensalidade; 
}

interface Acordo {
  id_acordo: number;
  status: 'Aberto' | 'Quebra' | 'Concluído';
  total_acordo: number | string;
  data_prevista: string;
  realizado_por: string;
  dt_criacao: string;
  descricao?: string | null;
  metodo_pag?: string | null;
  dt_pgto?: string | null;
  mensalidades: AcordoMensalidade[];
}
interface DetalhesAcordoProps {
  acordo: Acordo;
}

const DetalhesAcordo = ({ acordo }: DetalhesAcordoProps) => {
  const formatarData = (data: string | null | undefined) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  const formatarValor = (valor: number | string) => {
    return `R$ ${Number(valor).toFixed(2)}`
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Status</h3>
        <p className="mt-1 text-lg font-semibold">{acordo.status}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Total do Acordo</h3>
        <p className="mt-1 text-lg font-semibold">{formatarValor(acordo.total_acordo)}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
        <p className="mt-1 text-base text-gray-800">{acordo.descricao || '-'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Data Prevista</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(acordo.data_prevista)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Data de Pagamento</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(acordo.dt_pgto)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Data de Criação</h3>
          <p className="mt-1 text-base text-gray-800">{formatarData(acordo.dt_criacao)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Realizado Por</h3>
          <p className="mt-1 text-base text-gray-800">{acordo.realizado_por}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Método de Pagamento</h3>
          <p className="mt-1 text-base text-gray-800">{acordo.metodo_pag || '-'}</p>
        </div>
      </div>
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Mensalidades Incluídas no Acordo
        </h3>
        <ul className="divide-y divide-gray-200 rounded-md border">
          {acordo.mensalidades.map(({ mensalidade }) => (
            <li key={mensalidade.id_mensalidade} className="p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Parcela {mensalidade.parcela} ({mensalidade.referencia})
                </p>
                <p className={`text-xs ${mensalidade.status === 'P' ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {mensalidade.status === 'P' ? 'Pago' : 'Aberto'}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatarValor(mensalidade.valor_principal)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DetalhesAcordo;
