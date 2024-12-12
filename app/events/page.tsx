import React from 'react';
import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';
import SurveyCard from '../components/SurveyCard';
import getEvents from '../actions/getEvents';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

const Events = async () => {
  const currentUser = await getCurrentUser();
  const events = await getEvents();

  if (!currentUser) {
    return null;
  }

  if (events.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title='No upcoming events'
          subtitle="It looks like there are no events planned for now. Stay tuned for updates or plan your own"
          buttonLabel='Plan an event'
          type='event'
          showReset 
        />
      </ClientOnly>
    );
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Events</title>
      <ClientOnly>
        <Container>
          <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
            <div className='flex justify-center my-10'>
              <span className='font-bold text-4xl'>Events</span>
            </div>
            {events.map((survey) => {
              return (
                <SurveyCard
                  currentUser={currentUser}
                  key={survey.id}
                  data={survey}
                />
              )
            })}
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
}

export default Events;