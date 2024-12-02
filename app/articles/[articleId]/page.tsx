import getArticleById from '@/app/actions/getArticleById';
import getCurrentUser from '@/app/actions/getCurrentUser';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import ArticleClient from './ArticleClient';
import { Comfortaa, Lexend, Nunito, Nunito_Sans, Varela_Round } from 'next/font/google';


const nunito = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

interface IParams {
  articleId?: string;
}

const ArticlePage = async ({ params } : { params: IParams }) => {
  const article = await getArticleById(params);
  const currentUser = await getCurrentUser();

  if (!article) {
    return (
      <ClientOnly>
        <title>Dormistory | Search</title>
        <EmptyState />
      </ClientOnly>
    )
  }

  return (
    <div className={`overflow-y-auto max-h-full absolute right-0 ${nunito.className}`}>
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