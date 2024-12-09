import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';
import PageContent from './components/PageContent';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

const Pictures = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Gallery</title>
      <ClientOnly>
        <Container>
          <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
            <PageContent />
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
}

export default Pictures;