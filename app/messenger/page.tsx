import ClientOnly from '../components/ClientOnly';
import getCurrentUser from '../actions/getCurrentUser';
import MessengerEmptyState from '../components/MessengerEmptyState';
import IntroductionPage from '../components/IntroductionPage';


const Messenger = async () => {
  const currentUser = await getCurrentUser();

  return (
    <ClientOnly>
      <title>Dormistory | Messenger</title>
        <div className='max-w-[2520px] h-[86vh] w-[60vw] grid grid-cols-1 gap-8 fixed right-0 bottom-0'>
          <div className='hidden lg:block h-full w-full'>
            <MessengerEmptyState />
          </div>
        </div>
    </ClientOnly>
  );
}

export default Messenger;