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
}

const ResourceUpload: React.FC<ProofUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset='dormistory'
      options={{
        maxFiles: 1
      }}
    >
      {({ open }) => {
        return (
            <div
              onClick={() => open?.()}
              className={`relative cursor-pointer hover:opacity-70 transition p-20 ${value ? '' : 'border-solid border-2 border-primary rounded-md'} flex flex-col justify-center items-center gap-4 text-neutral-600`}
            >
              {!value && (
                <div>
                  <div className='flex flex-row gap-x-4'>
                    <FaFileImage size={50} />
                    <FaFileAudio size={50} />
                    <FaFileVideo size={50} />
                  </div>
                  <div className='font-semibold text-xl mt-4 text-center'>Click to upload</div>
                </div>
              )}
              {value && (
                <div className='absolute inset-0 w-full h-full'>
                  {value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mkv') ? (
                    <div className='flex justify-center items-center h-full'>
                      <video controls>
                        <source src={value} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <Image
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