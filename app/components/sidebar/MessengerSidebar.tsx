import MessengerChild from './MessengerChild';

async function MessengerSidebar({ children } : { children: React.ReactNode }) {
  return (
    <div className='h-full w-[26vw] ml-[248px] mt-4 flex flex-row'>
      <MessengerChild children={children} />
    </div>
  );
}

export default MessengerSidebar;