import ClientOnly from '../components/ClientOnly';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import getCurrentUser from '../actions/getCurrentUser';
import { Lexend } from 'next/font/google';
import getReportsByUserId from '../actions/getReportsByUserId';
import ReportCard from '../components/ReportCard';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: '400'
});

interface IParams {
  userId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

const Reports = async ({ searchParams }: { searchParams: IParams }) => {
  const { title, startDate, endDate, category } = await searchParams;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const orderedParams: IParams = {
    userId: currentUser.id,
    title: title || '',
    startDate: startDate || '',
    endDate: endDate || '',
    category: category || ''
  };

  const reports = await getReportsByUserId(orderedParams);

  if (reports?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title='No Reports Available'
          subtitle="We couldn't find your reports at the moment. This could be due to your current filters or because you haven't submitted any reports yet. Try adjusting the filters or resetting them"
          buttonLabel='Reset all filters'
          type='report'
          showReset 
        />
      </ClientOnly> 
    );
  }

  return (
    <div className={`mt-4 overflow-y-auto max-h-[86%] w-full absolute right-0 ${lexend.className}`}>
      <title>Dormistory | Reports</title>
      <ClientOnly>
        <Container>
          <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
            <div className='flex justify-center my-10'>
              <span className='font-bold text-4xl'>Your reports</span>
            </div>
            <div className='grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-10 px-20 xl:px-0 pb-12'>
              {reports.map((report) => {
                return (
                  <ReportCard
                    currentUser={currentUser}
                    key={report.id}
                    data={report}
                  />
                )
              })}
            </div>
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
}

export default Reports;