'use client';
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { useModalStore } from "@/stores/modalStore";
import FormularioCriarAcordo from "@/features/acordos/components/FormularioCriarAcordo";
import { useRouter } from "next/navigation";
import DetalhesMensalidade from "@/features/mensalidades/components/DetalhesMensalidade";
import ConfirmacaoModal from "@/components/ui/ConfirmacaoModal";

interface Acordo {
  id_acordo: number;
  status: 'Aberto' | 'Quebra' | 'Concluído';
  total_acordo: number | string;
  data_prevista: string;
}

interface AcordoMensalidade {
  acordo: Acordo
}

interface Mensalidade {
  id_mensalidade: number;
  parcela: number;
  data_emissao: string;
  vencimento: string;
  cobranca: string;
  data_pgto: string | null;
  hora_pgto?: string | null;
  valor_principal: number | string;
  valor_pago?: number | string | null; 
  status: 'A' | 'P'; 
  referencia: string;
  form_pagto?: string | null; 
  acordos: AcordoMensalidade[];
}

export default function Home() {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isCreateAgreementModalOpen, closeCreateAgreementModal } = useModalStore();
  const router = useRouter();

  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [mensalidadeParaPagar, setMensalidadeParaPagar] = useState<Mensalidade | null>(null);
  
  const fetchMensalidades = async () => {
    try {
      setIsLoading(true);
      const resposta = await api.get('/mensalidades');
      setMensalidades(resposta.data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar as mensalidades.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMensalidades();
  }, []);

  const handleVerDetalhes = (mensalidade: Mensalidade) => {
    setMensalidadeSelecionada(mensalidade);
    setModalDetalhesAberto(true);
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesAberto(false);
    setMensalidadeSelecionada(null);
  };

  const handleAcordoCriado = () => {
    fetchMensalidades();
  };

  const handleAbrirConfirmacaoPagamento = (mensalidade: Mensalidade) => {
    setMensalidadeParaPagar(mensalidade); 
    setIsConfirmModalOpen(true); 
  };

  const handleConfirmarPagamento = async () => {
    if (!mensalidadeParaPagar) return;

    try {
      await api.patch(`/mensalidades/${mensalidadeParaPagar.id_mensalidade}/pagar`, {
        valor_pago: mensalidadeParaPagar.valor_principal,
        form_pagto: 'Manual',
      });
      alert('Pagamento registrado com sucesso!');
      fetchMensalidades(); 
    } catch (error) {
      alert('Erro ao registrar o pagamento.');
      console.error(error);
    }


    setMensalidadeParaPagar(null);
  };

  if (isLoading) return <p className="text-center mt-8">Carregando...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Mensalidades</h2>
            <p className="text-gray-600">Lista de todas as mensalidades e seus status.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white items-center">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Parcela</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Referência</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Vencimento</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Valor</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Data Pagamento</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mensalidades.map((m) => (
                <tr key={m.id_mensalidade} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{m.parcela}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{m.referencia}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{new Date(m.vencimento).toLocaleDateString()}</td>
                  <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">R$ {Number(m.valor_principal).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${m.status === 'P' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {m.status === 'P' ? 'Pago' : 'Aberto'}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{m.data_pgto ? new Date(m.data_pgto).toLocaleDateString() : '-'}</td>
                  <td className="p-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col items-start gap-y-1">
                      {m.status === 'A' && (
                        <button
                          onClick={() => handleAbrirConfirmacaoPagamento(m)}
                          className="text-green-600 hover:underline"
                        >
                          Pagar
                        </button>
                      )}
                      <button
                        onClick={() => handleVerDetalhes(m)}
                        className="text-blue-600 hover:underline"
                      >
                        Detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal isOpen={isCreateAgreementModalOpen} onClose={closeCreateAgreementModal} title="Criar Novo Acordo">
        <FormularioCriarAcordo onAcordoCriado={handleAcordoCriado} />
      </Modal>

      <ConfirmacaoModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmarPagamento}
        title="Confirmar Pagamento"
        description={`Você tem certeza que deseja registrar o pagamento da parcela ${mensalidadeParaPagar?.parcela}?`}
      />

      <Modal isOpen={modalDetalhesAberto} onClose={handleFecharDetalhes} title={`Detalhes da Mensalidade #${mensalidadeSelecionada?.id_mensalidade}`}>
        {mensalidadeSelecionada &&
          <DetalhesMensalidade
            mensalidade={mensalidadeSelecionada} />}
      </Modal>
    </div>
  );
}