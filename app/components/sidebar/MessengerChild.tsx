const MessengerChild = ({ children } : { children: React.ReactNode }) => {
  return (
    <main className='h-[calc(100vh-128px)] w-[40vw] xl:w-[46vw] fixed bottom-0 left-0'>
      {children}
    </main>
  );
}

export default MessengerChild;