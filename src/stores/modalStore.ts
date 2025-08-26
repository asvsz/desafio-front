import { create } from 'zustand'

interface ModalState {
  isCreateAgreementModalOpen: boolean
  openCreateAgreementModal: () => void
  closeCreateAgreementModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateAgreementModalOpen: false,
  openCreateAgreementModal: () => set({ isCreateAgreementModalOpen: true}),
  closeCreateAgreementModal: () => set({ isCreateAgreementModalOpen: false})
}))