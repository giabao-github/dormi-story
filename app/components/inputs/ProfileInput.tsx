"use client";

import { ForwardedRef, forwardRef } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';


interface ProfileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  inputError?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  inputRef?: ForwardedRef<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>; 
}

const ProfileInput = forwardRef<HTMLInputElement, ProfileInputProps>(({ className, id, label, type = 'text', disabled, inputError, required, register, errors, inputRef, onKeyDown, onChange }, ref) => {
  return (
    <div className={`relative flex flex-col gap-y-2`}>
      <label className={`text-lg leading-6 mx-2 font-semibold ${errors[id] || inputError ? 'text-red-500' : 'text-gray-900'}`}>
        {label}
      </label>
      <input 
        id={id}
        disabled={disabled}
        placeholder=''
        type={type}
        {...register(id, { required })}
        ref={(element) => {
          if (element) {
            register(id).ref(element);
            if (typeof inputRef === "function") {
              inputRef(element);
            } else if (inputRef) {
              inputRef.current = element;
            }
          }
        }}
        onKeyDown={onKeyDown}
        onChange={onChange}
        className={twMerge(`px-3 py-2 mx-1 font-normal bg-white border-2 rounded-md outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors[id] || inputError ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary/70'}`, className)}  
      />
    </div>
  )
})

ProfileInput.displayName = 'ProfileInput';

export default ProfileInput;