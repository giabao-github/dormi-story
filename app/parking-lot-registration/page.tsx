import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import ArticleCard from '../components/articles/ArticleCard';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';
import getEvents from '../actions/getEvents';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

const ParkingLotRegistration = async () => {
  const currentUser = await getCurrentUser();
  const events = await getEvents();

  if (!currentUser) {
    return null;
  }

  if (events.length === 0) {
    return (
      <ClientOnly>
        <EmptyState  
          title='No registered information'
          subtitle="It seems you haven't registered a parking lot yet. You can register by clicking the button below"
          buttonLabel='Register now'
          type='parking lot'
          showReset 
        />
      </ClientOnly>
    );
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Parking Lot Registration</title>
      <ClientOnly>
        <Container>
          <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
            <div className='flex justify-center my-10'>
              <span className='font-bold text-4xl'>Parking Lot Registration</span>
            </div>
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
}

export default ParkingLotRegistration;