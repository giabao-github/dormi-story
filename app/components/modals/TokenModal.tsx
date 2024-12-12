"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IoWarning } from 'react-icons/io5';
import { RiExchangeFill } from 'react-icons/ri';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { MdContentCopy } from 'react-icons/md';
import useTokenModal from '@/app/hooks/useTokenModal';
import Modal from './Modal';
import { SafeUser } from '@/app/types';
import checkCorrectPassword from '@/app/actions/checkCorrectPassword';


interface TokenModalProps {
  currentUser?: SafeUser | null | undefined;
}

const TokenModal: React.FC<TokenModalProps> = ({ currentUser }) => {
  const tokenModal = useTokenModal();
  const [value, setValue] = useState('');
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrectPassword, setIsCorrectPassword] = useState(false);

  const generateRandomToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const handleMessengerToken = () => {
    setIsTokenVisible(!isTokenVisible);
  }

  const [token, setToken] = useState(currentUser?.messengerSecretToken || generateRandomToken());

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.remove();
    toast.success('Messenger Token copied to clipboard');
  }

  const updateToken = async () => {
    setIsLoading(true);
    axios
      .post('/api/token', { token })
      .then((callback) => {
        setIsLoading(false);

        if (callback.status === 200) {
          toast.remove();
          toast.success(callback.data.message);
        }
        
        if (callback.status === 400) {
          toast.remove();
          toast.error(callback.data.message);
          return;
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.remove();
          toast.error(error.response.data.message);
        }
        else {
          toast.remove();
          toast.error(error);
        }
        return;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const displayIcon = async () => {
      axios
      .post('/api/token/label')
      .then((callback) => {
        if (callback.data.message === 'Create') {
          tokenModal.onCreate();
        }
        
        if (callback.data.message === 'Update') {
          tokenModal.onUpdate();
        }
      })
    }
    displayIcon();
  } , []);

  useEffect(() => {
    const validatePassword = async () => {
      if (currentUser) {
        const isValid = await checkCorrectPassword(currentUser, value);
        setIsCorrectPassword(isValid);
      } else {
        setIsCorrectPassword(false);
      }
    };

    if (value) {
      validatePassword();
    } else {
      setIsCorrectPassword(false);
    }
  }, [value]);

  useEffect(() => {
    if (!tokenModal.isOpen) {
      setIsTokenVisible(false);
      setValue('');
    }
  }, [tokenModal.isOpen, isCorrectPassword]);

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
            type='password'
            placeholder={`Enter your password to continue`}
            onChange={(e) => setValue(e.target.value)}
            className='my-8 w-1/2 p-3 font-normal bg-white border-2 rounded-md outline-none border-neutral-300 focus:border-black' 
          />
          <button
            title=''
            type='button'
            onClick={handleMessengerToken}
            disabled={!isCorrectPassword}
            className='relative disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-1/2 bg-primary border-primary text-white py-2 text-lg font-semibold border-2' 
          >
            {`${isTokenVisible ? 'Hide Messenger Token' : 'Reveal Messenger Token'}`}
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
            title={`${tokenModal.label === 'update' ? 'Update Messenger Token' : 'Create Messenger Token'}`}
            disabled={!isTokenVisible}
            type='button'
            className='flex items-center mx-6 p-2 rounded-full bg-primary hover:opacity-70 disabled:opacity-50'
            onClick={updateToken}
          >
            {
              tokenModal.label === 'update' ? 
              <FaCheck size={20} className='text-white' /> :
              <FaPlus size={20} className='text-white' />
            }
          </button>
      </div>
    </div>
    </div>
  );


  return (
    <Modal
      disabled={isLoading}
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