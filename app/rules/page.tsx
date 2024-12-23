import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';
import PageContent from './component/PageContent';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

const Rules = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Rules</title>
      <ClientOnly>
        <Container>
          <PageContent />
        </Container>
      </ClientOnly>
    </div>
  );
}

export default Rules;