'use client'
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useModalStore } from "@/stores/modalStore";
import Modal from "@/components/ui/Modal";
import FormularioCriarAcordo from "@/features/acordos/components/FormularioCriarAcordo";
import { useRouter } from "next/navigation";

interface Installments {

  id_mensalidade: number;
  parcela: number;
  referencia: string;
  vencimento: string;
  valor_principal: number | string;
  status: 'A' | 'P';
  data_pgto: string | null;

}

export default function Home() {

  const [mensalidades, setMensalidades] = useState<Installments[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isCreateAgreementModalOpen, closeCreateAgreementModal } = useModalStore()
  const router = useRouter()


  const handleAcordoCriado = () => {
    router.refresh()
  }
  useEffect(() => {
    const buscarInstallments = async () => {
      try {
        setIsLoading(true)
        const resposta = await api.get('/mensalidades');
        setMensalidades(resposta.data)
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
      <main>
        <h2 className="text-xl text-gray-600 font-semibold mb-2 container mx-auto px-1 py-1">Mensalidades</h2>
        <p className="text-gray-600 mb-4 container mx-auto px-1 py-1">Lista de todas as mensalidades e seus status.</p>

        <div className="overflow-x-auto rounded-lg border container mx-auto px-1 py-1">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Parcela</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Referência</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Vencimento</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Valor</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Data Pagamento</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Ações</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mensalidades.map((m) => (
                <tr key={m.id_mensalidade} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{m.parcela}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">{m.referencia}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                    {new Date(m.vencimento).toLocaleDateString()}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {Number(m.valor_principal).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${m.status === 'P' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {m.status === 'P' ? 'Pago' : 'Aberto'}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-800">
                    {m.data_pgto ? new Date(m.data_pgto).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:underline">Editar</button>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:underline">Detalhes</button>
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
    </div>
  );
}
