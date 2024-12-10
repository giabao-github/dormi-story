"use client";

import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { TiAttachmentOutline } from 'react-icons/ti';
import useConversation from '@/app/hooks/useConversation';
import MessageInput from './MessageInput';
import { PiPaperPlaneRightFill } from 'react-icons/pi';
import { CldUploadButton } from 'next-cloudinary';
import { SafeUser } from '@/app/types';


interface FormProps {
  currentUser?: SafeUser | null;
}

const Form: React.FC<FormProps> = ({ currentUser }) => {
  const { conversationId } = useConversation();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!currentUser) {
      return;
    }

    setValue('message', '', { shouldValidate: true });

    try {
      await axios.post('/api/messages', {
        ...data,
        conversationId
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    })
  }


  return (
    <div className='px-4 bg-white border-t border-l flex items-center gap-4 lg:gap-6 w-full h-[12%] shadow-sm'>
      <CldUploadButton
        options={{ 
          maxFiles: 1, 
          resourceType: 'auto',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv'],
        }}
        onSuccess={handleUpload}
        uploadPreset='dormistory'
      >
        <TiAttachmentOutline size={32} className='text-primary hover:scale-105' title='Upload a file' />
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