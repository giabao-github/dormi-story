"use client";

import { Varela_Round } from 'next/font/google';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const varelaRound = Varela_Round({
  subsets: ["latin", "vietnamese"],
  weight: ['400']
})

interface UploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  disabled?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>; 
}

const UploadInput = forwardRef<HTMLInputElement, UploadInputProps>(({ className, type = 'text', disabled, onKeyDown, ...props }, ref) => {
  return (
    <div className={`relative ${varelaRound.className}`}>
      <input 
        disabled={disabled}
        type={type}
        onKeyDown={onKeyDown}
        className={twMerge(`peer w-full p-4 pt-6 font-normal bg-white border-2 rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`, className)}  
        ref={ref}
        {...props}
      />
    </div>
  )
})

UploadInput.displayName = 'UploadInput';

export default UploadInput;