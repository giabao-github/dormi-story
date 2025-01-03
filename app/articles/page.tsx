import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import getArticles from '../actions/getArticles';
import ArticleCard from './components/ArticleCard';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

interface IParams {
  userId?: string;
  title?: string;
  authorName?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

const Articles = async ({ searchParams }: { searchParams: IParams }) => {
  const { title, authorName, startDate, endDate, category } = await searchParams;
    const currentUser = await getCurrentUser();

  const orderedParams: IParams = {
    userId: currentUser?.id,
    title: title || '',
    authorName: authorName || '',
    startDate: startDate || '',
    endDate: endDate || '',
    category: category || ''
  };

  const articles = await getArticles(orderedParams);

  if (!currentUser) {
    return null;
  }

  if (articles.length === 0) {
    return (
      <ClientOnly>
        <EmptyState  
          title='No Articles Available'
          subtitle='There are no articles to display. This could be due to your current filters or because no articles have been posted yet. Try adjusting your filters or posting a new article'
          buttonLabel='Reset all filters'
          type='article'
          showReset 
        />
      </ClientOnly>
    );
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Articles</title>
      <ClientOnly>
        <Container>
          <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
            <div className='flex justify-center my-10'>
              <span className='font-bold text-4xl'>Articles</span>
            </div>
            {articles.map((article) => (
              <ArticleCard
                currentUser={currentUser}
                key={article.id}
                data={article}
              />
            ))}
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
};

export default Articles;
