"use client";

import { useMemo } from 'react';
import { SafeArticle, SafeUser } from '@/app/types';
import ArticleHead from '@/app/components/articles/ArticleHead';
import Container from '@/app/components/Container';
import { categories } from '@/app/components/modals/ArticleModal';
import ArticleInfo from '@/app/components/articles/ArticleInfo';


interface ArticleClientProps {
  article: SafeArticle & { user: SafeUser };
  currentUser?: SafeUser | null;
}

const ArticleClient: React.FC<ArticleClientProps> = ({ article, currentUser }) => {
  const category = useMemo(() => {
    return categories.find((item) => item.label === article.category);
  }, [article.category]);

  return (
    <Container>
      <div className='ml-[248px] max-w-screen-2xl h-full mt-16 mb-32'>
        <div className='flex flex-col gap-6 mx-40'>
          <ArticleHead
            title={article.title}
            time={article.createdAt}
            category={article.category}
            author={article.user}
            id={article.id}
            currentUser={currentUser}
          />
          <div className='grid md:grid-cols-7 md:gap-10 lg:grid-cols-1 mt-6'>
            <ArticleInfo
              user={article.user}
              title={article.title} 
              category={category}
              files={article.files}
              intro={article.introduction || ''}
              content={article.content}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ArticleClient;