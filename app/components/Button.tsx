"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  primary?: boolean;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({ primary, label, onClick, disabled, outline, small, icon: Icon }) => {  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full ${outline ? 'bg-white border-black text-black' : primary ? 'bg-primary border-primary text-white' : 'bg-button border-button text-white'} ${small ? 'py-1 text-base font-medium border-[1px]' : 'py-3 text-lg font-medium border-2'}`}  
    >
      {Icon && (
        <Icon size={24} className='absolute left-4 top-3' />
      )}
      {label}
    </button>
  );
}

export default Button;