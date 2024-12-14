import getArticleById from '@/app/actions/getArticleById';
import getCurrentUser from '@/app/actions/getCurrentUser';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import ArticleClient from './ArticleClient';
import { Lexend } from 'next/font/google';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

interface IParams {
  articleId?: string;
}

const ArticlePage = async ({ params } : { params: IParams }) => {
  const article = await getArticleById(params);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  if (!article) {
    return (
      <ClientOnly>
        <title>Dormistory | Article</title>
        <EmptyState />
      </ClientOnly>
    )
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>{`Dormistory | ${article.title}`}</title>
      <ClientOnly>
        <ArticleClient
          article={article}
          currentUser={currentUser}
        />
      </ClientOnly>
    </div>
  );
}

export default ArticlePage;