"use client";

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback } from 'react';
import { FaFileImage, FaFileAudio, FaFileVideo } from 'react-icons/fa6';

declare global {
  let cloudinary: any;
}

interface ProofUploadProps {
  onChange: (value: string) => void;
  value: string;
  limited?: string;
}

const ResourceUpload: React.FC<ProofUploadProps> = ({ onChange, value, limited }) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset='dormistory'
      options={{
        resourceType: limited || '',
        maxFiles: 1
      }}
    >
      {({ open }) => {
        return (
            <div
              onClick={() => open?.()}
              className={`relative cursor-pointer hover:opacity-70 transition p-20 ${value ? '' : 'border-dashed border-2 border-primary rounded-md'} flex flex-col justify-center items-center gap-4 text-neutral-600`}
            >
              {!value && (
                <div>
                  <div className='flex justify-center flex-row gap-x-4'>
                    {limited && limited === 'image' && (
                      <FaFileImage size={50} />
                    )}
                    {limited && limited === 'audio' && (
                      <FaFileAudio size={50} />
                    )}
                    {limited && limited === 'video' && (
                      <FaFileVideo size={50} />
                    )}
                    {!limited && (
                      <>
                        <FaFileImage size={50} />
                        <FaFileAudio size={50} />
                        <FaFileVideo size={50} />
                      </>
                    )}
                  </div>
                  <div className='font-semibold text-xl mt-4 text-center'>Click to upload</div>
                </div>
              )}
              {value && (
                <div className='absolute inset-0 w-full h-full'>
                  {(value.endsWith('.mp4') || value.endsWith('.mov') || value.endsWith('.webm') || value.endsWith('.mkv')) && (!limited || limited === 'video') ? (
                    <div className='flex justify-center items-center h-full'>
                      <video controls>
                        <source src={value} type='video/*' />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : 
                  (value.endsWith('.mp3') || value.endsWith('.wav') || value.endsWith('.flac') || value.endsWith('.m4a')) && (!limited || limited === 'audio') ? (
                    <div className='flex justify-center items-center h-full'>
                      <audio controls>
                        <source src={value} type='audio/*' />
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )
                  :
                  (<Image
                      alt='Upload'
                      fill
                      style={{ objectFit: 'contain' }}
                      src={value}
                    />
                  )}
                </div>
              )}
            </div>
        )
      }}
    </CldUploadWidget>
  );
}

export default ResourceUpload;