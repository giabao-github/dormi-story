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

  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2 text-neutral-800'>
        <div className='mt-4 text-lg italic'>{intro}</div>
        <div className='w-full h-[60vh] rounded-xl relative'>
          <Image
            alt={title}
            src={files}
            fill
            className='object-contain w-full my-10'
          />
        </div>
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