import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';
import getParkingSpotByUserId from '../actions/getParkingSpotByUserId';
import PageContent from './components/PageContent';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});


const ParkingLotRegistration = async () => {
  const currentUser = await getCurrentUser();
  const parkingSpots = await getParkingSpotByUserId();
  const takenSpot = parkingSpots.find((spot) => spot.userId === currentUser?.id && spot.status === 'taken');
  const hasTaken = parkingSpots.some((spot) => spot.status === 'taken');

  if (!currentUser) {
    return null;
  }

  if (parkingSpots.length === 0) {
    return (
      <ClientOnly>
        <title>Dormistory | Parking Spot Registration</title>
        <EmptyState  
          title='No registered information'
          subtitle="It seems you haven't registered a parking spot yet. You can register one by clicking the button below"
          buttonLabel='Register now'
          type='parking lot'
          showReset 
        />
      </ClientOnly>
    );
  } 

  if (!hasTaken) {
    return (
      <ClientOnly>
        <title>Dormistory | Parking Spot Registration</title>
        <EmptyState  
          title='Pay your parking fee'
          subtitle="It seems you haven't paid your parking fee yet. Please go to the Finance Office to pay and complete your registration."
          buttonLabel='View status'
          type='parking lot'
          showReset 
        />
      </ClientOnly>
    );
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Your Parking Spot</title>
      <ClientOnly>
        <Container>
          <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
            <div className='flex justify-center my-10'>
              <span className='font-bold text-4xl'>Your Registered Parking Spot</span>
            </div>
            <PageContent parkingSpot={takenSpot} />
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
}

export default ParkingLotRegistration;