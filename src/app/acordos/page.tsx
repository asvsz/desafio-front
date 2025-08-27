'use client'
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useModalStore } from "@/stores/modalStore";
import Modal from "@/components/ui/Modal";
import FormularioCriarAcordo from "@/features/acordos/components/FormularioCriarAcordo";
import { useRouter } from "next/navigation";
import DetalhesAcordo from "@/features/acordos/components/DetalhesAcordo";

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
interface Acordos {
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

export default function Home() {

  const [acordos, setAcordos] = useState<Acordos[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isCreateAgreementModalOpen, closeCreateAgreementModal } = useModalStore()
  const router = useRouter()

  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [acordoSelecionado, setAcordoSelecionado] = useState<Acordos | null>(null);

  const handleVerDetalhes = (acordo: Acordos) => {
    setAcordoSelecionado(acordo);
    setModalDetalhesAberto(true);
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesAberto(false);
    setAcordoSelecionado(null);
  };

  const handleAcordoCriado = () => {
    router.refresh()
  }
  useEffect(() => {
    const buscarInstallments = async () => {
      try {
        setIsLoading(true)
        const resposta = await api.get('/acordos');
        setAcordos(resposta.data)
        setError(null)
      } catch (err) {
        setError('Falha ao carregar as mensalidades.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    buscarInstallments()
  }, [])

  if (isLoading) return <p className="text-center mt-8">Carregando...</p>
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Acordos</h2>
            <p className="text-gray-600">Lista de todas os acordos e seus status.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white items-center">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Número do Acordo</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Total do Acordo</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Data Prevista</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Realizado Por</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Data de Criação</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {acordos.map((a) => (
                <tr key={a.id_acordo}>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{a.id_acordo}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${a.status === 'Concluído'
                        ? 'bg-green-100 text-green-800'
                        : a.status === 'Quebra'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {Number(a.total_acordo).toFixed(2)}
                  </td>

                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                    {new Date(a.data_prevista).toLocaleDateString()}
                  </td>

                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                    {a.realizado_por}
                  </td>

                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                    {new Date(a.dt_criacao).toLocaleDateString()}
                  </td>

                  <td className="p-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleVerDetalhes(a)}
                      className="text-blue-600 hover:underline"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal
        isOpen={isCreateAgreementModalOpen}
        onClose={closeCreateAgreementModal}
        title="Criar Novo Acordo"
      >
        <FormularioCriarAcordo onAcordoCriado={handleAcordoCriado} />
      </Modal>

      <Modal
        isOpen={modalDetalhesAberto}
        onClose={handleFecharDetalhes}
        title={`Detalhes do Acordo #${acordoSelecionado?.id_acordo}`}
      >

        {acordoSelecionado && <DetalhesAcordo acordo={acordoSelecionado} />}
      </Modal>
    </div>
  );
}
