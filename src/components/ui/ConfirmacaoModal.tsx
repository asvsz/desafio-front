'use client';
import Modal from './Modal'; 
import Button from './Button'; 

interface ConfirmacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmacaoModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmacaoModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600">{description}</p>
        <div className="flex justify-end gap-4">
          <Button texto="Cancelar" onClick={onClose} />
          <Button
            texto="Confirmar"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmacaoModal;