"use client";

import { SafeUser } from "@/app/types";
import Image from "next/image";
import { IconType } from "react-icons";

interface ArticleInfoProps {
  user: SafeUser;
  title: string;
  files: string;
  intro: string;
  content: string;
  category: {
    icon: IconType;
    label: string;
    description: string;
  } | undefined
}
const ArticleInfo: React.FC<ArticleInfoProps> = ({
  user,
  title,
  files,
  intro,
  content,
  category
}) => {

  const styleSubheadings = (content: string) => {
    const regex = /\[\#\#\#(.*?)\]/g;

    return content.split('\n').map((line, id) => {
      const match = line.match(regex);

      // Sub-heading
      if (match) {
        const subheading = match[0].replace('[###', '').replace(']', '');
        return (
          <div key={id} className='font-semibold text-xl'>
            {subheading}
          </div>
        );
      }
      // Normal text 
      else {
        return (
          <div className='font-normal text-lg'>
            <span key={id}>
              {line}
              <br />
            </span>
          </div>
        );
      }
    });
  };

  const getFileType = (file: string) => {
    if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.flac') || file.endsWith('.m4a')) {
      return 'audio';
    } else if (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.webm') || file.endsWith('.mkv')) {
      return 'video';
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.svg') || file.endsWith('.webp')) {
      return 'image';
    }
  };

  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2 text-neutral-800'>
        <div className='mt-4 text-lg italic'>{intro}</div>
        {files && getFileType(files) === 'image' && (
          <div className='w-full h-[60vh] rounded-xl relative'>
            <Image
              alt={title}
              src={files}
              fill
              className='object-contain w-full my-10'
            />
          </div>
        )}
        {files && getFileType(files) === 'audio' && (
          <div className='flex justify-center items-center h-full'>
            <audio controls>
              <source src={files} type='audio/*' />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
        {files && getFileType(files) === 'video' && (
          <div className='flex justify-center items-center h-full'>
            <video controls>
              <source src={files} type='video/*' />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <div className='h-full mx-6 my-12 flex flex-row items-center gap-4'>
          <div className='font-normal text-lg'>
            {styleSubheadings(content)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleInfo;