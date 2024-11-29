"use client";

import { IoWarning } from 'react-icons/io5';
import useTokenModal from "@/app/hooks/useTokenModal";
import Modal from "./Modal";
import { useEffect, useState } from 'react';
import { RiExchangeFill } from 'react-icons/ri';
import { MdContentCopy } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import toast from 'react-hot-toast';


const TokenModal = () => {
  const tokenModal = useTokenModal();
  const [value, setValue] = useState('');
  const [isTokenVisible, setIsTokenVisible] = useState(false);

  const generateRandomToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const revealMessengerToken = () => {
    setIsTokenVisible(true);
  }

  const [token, setToken] = useState(generateRandomToken());

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.remove();
    toast.success('Messenger Token copied to clipboard');
  }

  const updateToken = () => {
    toast.remove();
    toast.success('Messenger Token updated successfully');
  }

  useEffect(() => {
    if (!tokenModal.isOpen) {
      setIsTokenVisible(false);
    }
  }, [tokenModal.isOpen]);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mt-2 mb-6 text-center'>
        <div className='flex justify-center'>
          <div className='w-11/12 flex justify-center text-lg font-bold text-red-500'>
            <IoWarning size={30} className='text-red-500' />
            Important Note:&nbsp;&nbsp;DO NOT share your Messenger Token to strangers, only share it to who you want to connect on Messenger
          </div>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <input 
            title=''
            type='text'
            placeholder={`Type "I understand" to continue`}
            onChange={(e) => setValue(e.target.value)}
            className='my-8 w-1/2 p-3 font-normal bg-white border-2 rounded-md outline-none border-neutral-300 focus:border-black' 
          />
          <button
            title=''
            type='button'
            onClick={revealMessengerToken}
            disabled={value.toLowerCase() !== 'i understand'}
            className='relative disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-1/2 bg-primary border-primary text-white py-2 text-lg font-medium border-2' 
          >
            Reveal Messenger Token
          </button>
        </div>
        <div className='mt-14 mb-3 px-10 text-black text-xl text-start font-bold'>
          Your Messenger Token
        </div>
        <div className='flex flex-row justify-start items-center py-4 px-10'>
          <div className='w-1/2 py-3 px-6 mr-2 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
            {isTokenVisible ? token : '******************************'}
          </div>
          <button
            title='Change Messenger Token'
            disabled={!isTokenVisible}
            type='button'
            className='flex items-center mx-6 hover:opacity-70 disabled:opacity-50'
            onClick={() => setToken(generateRandomToken())}
          >
            <RiExchangeFill size={40} className='text-primary' />
          </button>
          <button
            title='Copy Messenger Token'
            disabled={!isTokenVisible}
            type='button'
            className='flex items-center p-2 rounded-full bg-primary hover:opacity-70 disabled:opacity-50'
            onClick={copyToken}
          >
            <MdContentCopy size={20} className='text-white' />
          </button>
          <button
            title='Update Messenger Token'
            disabled={!isTokenVisible}
            type='button'
            className='flex items-center mx-6 p-2 rounded-full bg-primary hover:opacity-70 disabled:opacity-50'
            onClick={updateToken}
          >
            <FaCheck size={20} className='text-white' />
          </button>
      </div>
    </div>
    </div>
  );


  return (
    <Modal
      title='Messenger Token'
      isOpen={tokenModal.isOpen}
      onClose={tokenModal.onClose}
      onSubmit={tokenModal.onClose}
      actionLabel='Close'
      body={bodyContent}
    />
  );
}

export default TokenModal;