"use client";

import { Fragment } from 'react';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import { HashLoader } from 'react-spinners'

const LoadingModal = () => {
  return (
    <Transition show as={Fragment}>
      <Dialog 
        as='div' 
        className='relative z-50' 
        onClose={() => {}}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            className='fixed inset-0 bg-gray-100/50 transition-opacity'
          />
        </TransitionChild>
        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <DialogPanel>
              <HashLoader size={50} color='#1EB589' />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default LoadingModal;