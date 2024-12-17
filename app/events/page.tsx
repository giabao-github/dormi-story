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

interface IParams {
  userId?: string;
  title?: string;
  creator?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

const Events = async ({ searchParams }: { searchParams: IParams }) => {
  const { title, creator, startDate, endDate, category } = await searchParams || {};
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const orderedParams: IParams = {
    userId: currentUser.id,
    title: title || '',
    creator: creator || '',
    startDate: startDate || '',
    endDate: endDate || '',
    category: category || ''
  };

  const events = await getEvents(orderedParams);

  if (events.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title='No Upcoming Events'
          subtitle="There are no events to display. This could be due to your current filters or because no events have been scheduled yet. Try adjusting your filters or scheduling an event"
          buttonLabel='Reset all filters'
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