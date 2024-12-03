import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import getArticles from '../actions/getArticles';
import ArticleCard from '../components/articles/ArticleCard';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

const Articles = async () => {
  const currentUser = await getCurrentUser();
  const articles = await getArticles();

  if (!currentUser) {
    return null;
  }

  if (articles.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <title>Dormistory | Articles</title>
      <Container>
        <div className={`ml-[241px] mt-32 grid grid-cols-1 gap-8 ${lexend.className}`}>
          {articles.map((article) => {
            return (
              <ArticleCard
                currentUser={currentUser}
                key={article.id}
                data={article}
              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  );
}

export default Articles;