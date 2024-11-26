"use client";

import { Varela_Round } from 'next/font/google';
import { ForwardedRef, forwardRef } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { HiCurrencyDollar } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';

const varelaRound = Varela_Round({
  subsets: ["latin", "vietnamese"],
  weight: ['400']
})

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  inputRef?: ForwardedRef<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>; 
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, id, label, type = 'text', disabled, formatPrice, required, register, errors, inputRef, onKeyDown }, ref) => {
  return (
    <div className={`w-full relative ${varelaRound.className}`}>
      {formatPrice && (
        <HiCurrencyDollar size={24} className='text-black absolute top-5 left-2' />
      )}
      <input 
        id={id}
        disabled={disabled}
        placeholder=' '
        type={type}
        {...register(id, { required })}
        ref={(element) => {
          if (element) {
            register(id).ref(element);
            if (typeof inputRef === "function") inputRef(element);
            else if (inputRef) inputRef.current = element;
          }
        }}
        onKeyDown={onKeyDown}
        className={twMerge(`peer w-full p-4 pt-6 font-normal bg-white border-2 rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${formatPrice ? 'pl-9' : 'pl-4'} ${errors[id] ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'}`, className)}  
      />
      <label className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] ${formatPrice ? 'left-9' : 'left-4'} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${errors[id] ? 'text-red-500' : 'text-zinc-500'}`}>
        {label}
      </label>
    </div>
  )
})

Input.displayName = 'Input';

export default Input;