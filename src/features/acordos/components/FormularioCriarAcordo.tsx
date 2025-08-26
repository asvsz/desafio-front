'use client'
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useModalStore } from "@/stores/modalStore";

interface MensalidadesDisponivel {
  id_mensalidade: number;
  parcela: number;
  referencia: string;
  vencimento: string;
  valor_principal: number | string;
}

interface FormularioProps {
  onAcordoCriado: () => void
}

const FormularioCriarAcordo = ({ onAcordoCriado }: FormularioProps) => {

  const [mensalidades, setMensalidades] = useState<MensalidadesDisponivel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selecionadas, setSelecionadas] = useState<number[]>([])
  const [dataPrevista, setDataPrevista] = useState('')
  const [metodoPag, setMetodoPag] = useState('');
  const [descricao, setDescricao] = useState('')
  const [realizadoPor, setRealizadoPor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { closeCreateAgreementModal } = useModalStore()

  useEffect(() => {
    const buscarMensalidadesDisponiveis = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/mensalidades/disponiveis')
        setMensalidades(response.data)
      } catch (err) {
        setError('Não foi possível carregar as mensalidades elegíveis.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    buscarMensalidadesDisponiveis()
  }, [])


  const handleSelect = (id: number) => {
    setSelecionadas((prevSelecionadas) => {

      if (prevSelecionadas.includes(id)) {
        return prevSelecionadas.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelecionadas, id];
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const dadosParaApi = {
        mensalidadesIds: selecionadas,
        data_prevista: new Date(dataPrevista).toISOString(),
        metodo_pag: metodoPag,
        descricao: descricao,
        realizado_por: realizadoPor
      }

      await api.post('/acordos', dadosParaApi)
      alert('Acordo criado com sucesso!')
      onAcordoCriado()
      closeCreateAgreementModal()
    } catch (err) {
      alert('Erro ao criar o acordo. Tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Seção 1: Dados do Acordo (campos de formulário) */}
        <div>
          <h3 className="text-lg font-medium">Dados do Acordo</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="data_prevista" className="block text-sm font-medium text-gray-700">Data Prevista</label>
              <input
                type="date"
                id="data_prevista"
                required
                value={dataPrevista}
                onChange={(e) => setDataPrevista(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 
                shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="metodo_pag" className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
              <select
                id="metodo_pag"
                value={metodoPag}
                onChange={(e) => setMetodoPag(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                <option value="">Selecione...</option>
                <option value="Pix">Pix</option>
                <option value="Boleto">Boleto Bancário</option>
                <option value="CartaoCredito">Cartão de Crédito</option>
                <option value="Transferencia">Transferência Bancária</option>
                <option value="DinheiroEspecie">Dinheiro em Espécie</option>
              </select>
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 
                shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="realizado_por" className="block text-sm font-medium text-gray-700">Realizado por</label>
              <input
                type="text"
                id="realizado_por"
                required
                value={realizadoPor}
                onChange={(e) => setRealizadoPor(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 
                shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>

          </div>
        </div>

        {/* Seção 2: Mensalidades Elegíveis */}
        <div>
          <h3 className="text-lg font-medium">Mensalidades Elegíveis (Status: Aberto)</h3>
          <div className="mt-4 max-h-60 overflow-y-auto rounded-md border border-gray-200">
            {isLoading && <p className="p-4">Carregando...</p>}
            {error && <p className="p-4 text-red-500">{error}</p>}
            {!isLoading && !error && (
              <ul className="divide-y divide-gray-200">
                {mensalidades.map((m) => (
                  <li key={m.id_mensalidade} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mensalidade-${m.id_mensalidade}`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selecionadas.includes(m.id_mensalidade)}
                        onChange={() => handleSelect(m.id_mensalidade)}
                      />
                      <label htmlFor={`mensalidade-${m.id_mensalidade}`} className="ml-3 text-sm text-gray-800">
                        Parcela {m.parcela} - {m.referencia}
                        <span className="block text-xs text-gray-500">
                          Vencimento: {new Date(m.vencimento).toLocaleDateString()}
                        </span>
                      </label>
                    </div>
                    <span className="text-sm font-semibold">
                      R$ {Number(m.valor_principal).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Seção 3: Botões de Ação */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
        <button type="button" onClick={closeCreateAgreementModal} className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400" disabled={selecionadas.length === 0 || isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Acordo'}
        </button>
      </div>
    </form>
  )
}

export default FormularioCriarAcordo;