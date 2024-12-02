"use client";

import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FaImage } from 'react-icons/fa6';
import useConversation from '@/app/hooks/useConversation';
import MessageInput from './MessageInput';
import { PiPaperPlaneRightFill } from 'react-icons/pi';
import { CldUploadButton } from 'next-cloudinary';

const Form = () => {
  const { conversationId } = useConversation();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });

    axios.post('/api/messages', {
      ...data,
      conversationId
    })
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    })
  }


  return (
    <div className='px-4 bg-white border-t flex items-center gap-4 lg:gap-6 w-full h-[12%] shadow-md'>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset='dormistory'
      >
        <FaImage size={32} className='text-primary' />
      </CldUploadButton>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-4 lg:gap-6 w-full'
      >
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder='Type a message'
        />
        <button
          title='Send'
          type='submit'
        >
          <PiPaperPlaneRightFill
            size={32}
            className='rounded-full cursor-pointer text-primary/80 hover:text-primary transition'
          />
        </button>
      </form>
    </div>
  );
}

export default Form;