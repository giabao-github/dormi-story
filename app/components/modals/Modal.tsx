"use client";

import { Rowdies } from "next/font/google";
import { LegacyRef, useCallback, useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "../Button";

const rowdies = Rowdies({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"]
});

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  ref?: LegacyRef<HTMLDivElement> | undefined; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, body, footer, actionLabel, disabled, secondaryAction, secondaryActionLabel, ref }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (!secondaryAction || disabled) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  const modalClass = `${showModal ? 'opacity-100' : 'opacity-0'} ${
    title === 'Sign In'
      ? showModal
        ? 'translate-y-[0%]'
        : 'translate-y-full'
      : title === 'Sign Up'
      ? showModal
        ? 'translate-y-[0%]'
        : 'translate-y-full'
      : ''
  }`;


  return (
    <>
      <div ref={ref} className='flex items-center justify-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none focus:shadow-sm bg-neutral-800/70'>
        <div className='relative w-full md:w-2/3 lg:w-1/2 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto'>
          {/* CONTENT */}
          <div className={`translate duration-300 h-full ${modalClass} `}>
            <div className='translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
              {/* HEADER */}
              <div className='flex items-center p-6 rounded-t justify-center relative border-b-[1px]'>
                <button 
                  onClick={handleClose}
                  type='button' 
                  title='Close' 
                  className='p-1 border-0 hover:text-red-500 transition absolute right-9 top-4'>
                  <IoCloseCircleOutline size={24} />
                </button>
                <div className={`text-4xl font-semibold ${rowdies.className}`}>
                  {title}
                </div>
              </div>
              {/* BODY */}
              <div className='relative p-6 flex-auto'>
                {body}
              </div>
              {/* FOOTER */}
              <div className='flex flex-col gap-2 p-6'>
                <div className={`flex flex-row items-center gap-4 w-full ${rowdies.className}`}>
                  {secondaryAction && secondaryActionLabel && (
                    <Button primary outline label={secondaryActionLabel} onClick={handleSecondaryAction} disabled={disabled} />
                  )}
                  {(title === 'Sign In' || title === 'Messenger Token' || title === 'Post An Article' || title === 'Create A Survey' || title === 'Plan An Event' || title === 'Filters') ? 
                    <Button primary label={actionLabel} onClick={handleSubmit} disabled={disabled} /> : 
                    <Button label={actionLabel} onClick={handleSubmit} disabled={disabled} />
                  }
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;