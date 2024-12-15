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

interface IParams {
  title?: string;
  authorName?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

const Articles = async ({ searchParams }: { searchParams: IParams }) => {
  const { title, authorName, startDate, endDate, category } = await searchParams;

  const orderedParams: IParams = {
    title: title || '',
    authorName: authorName || '',
    startDate: startDate || '',
    endDate: endDate || '',
    category: category || ''
  };

  const currentUser = await getCurrentUser();
  const articles = await getArticles(orderedParams);

  if (!currentUser) {
    return null;
  }

  if (articles.length === 0) {
    return (
      <ClientOnly>
        <EmptyState  
          title='No articles found'
          subtitle='It seems there is nothing to read here. Try changing some of the filters or reset all filters'
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
