'use client'

interface ButtonProps {
  icone?: React.ReactNode;
  texto: string;
  onClick?: () => void;
}

const Button = ({ icone, texto, onClick }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 border border-transparent 
      rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {icone}
      {texto}
    </button>
  )
}

export default Button;