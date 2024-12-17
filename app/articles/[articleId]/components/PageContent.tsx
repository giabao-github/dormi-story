"use client";

import { useRouter } from 'next/navigation';
import { IoChevronBackOutline } from 'react-icons/io5';
import { Nunito } from 'next/font/google';
import ClientOnly from '@/app/components/ClientOnly';
import ArticleClient from './ArticleClient';
import { SafeArticle, SafeUser } from '@/app/types';


const nunito = Nunito({
  subsets: ['cyrillic', 'latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

interface PageContentProps {
  article: SafeArticle & { user: SafeUser };
  currentUser?: SafeUser | null;
}

const PageContent: React.FC<PageContentProps> = ({ article, currentUser }) => {
  const router = useRouter();

  return (
    <ClientOnly>
      <div 
        onClick={() => router.back()}
        className={`ml-[328px] my-12 w-fit flex items-center flex-row gap-x-2 text-black hover:text-primary cursor-pointer ${nunito.className}`}
      >
        <IoChevronBackOutline size={24} />
        <div className='font-semibold text-xl'>
          Articles
        </div>
      </div>
      <ArticleClient
        article={article}
        currentUser={currentUser} 
      />
      </ClientOnly>
  );
}

export default PageContent;