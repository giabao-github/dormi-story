import './globals.css';
import { Nunito } from 'next/font/google';
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';
import Sidebar from './components/sidebar/Sidebar';
import IntroductionPage from './components/IntroductionPage';
import TokenModal from './components/modals/TokenModal';
import ReportModal from './components/modals/ReportModal';
import ArticleModal from './components/modals/ArticleModal';
import ActiveStatus from './components/ActiveStatus';
import SurveyModal from './components/modals/SurveyModal';
import EventModal from './components/modals/EventModal';
import ReportCardModal from './components/modals/ReportCardModal';
import SearchModal from './components/modals/SearchModal';
import FriendRequestsModal from './components/modals/FriendRequestsModal';
import { getSentFriendRequests } from './actions/getSentFriendRequests';
import { getReceivedFriendRequests } from './actions/getReceivedFriendRequests';
import getFriendsByUserId from './actions/getFriendsByUserId';


const nunito = Nunito({
  subsets: ['cyrillic', 'latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const sentRequests = await getSentFriendRequests(currentUser?.id || '');
  const receivedRequests = await getReceivedFriendRequests(currentUser?.id || '');
  const friendList = await getFriendsByUserId();
  const pendingRequests = receivedRequests.filter((request) => request.status === 'Pending');
  const notification = receivedRequests.length > 0 ? pendingRequests.length : 0;

  return (
    <html lang='en'>
      <title>Dormistory | Home Page</title>
      <ClientOnly>
        <body className={`overflow-hidden ${nunito.className}`}>
          <ToasterProvider />
          <ActiveStatus />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <ReportCardModal />
          <FriendRequestsModal sentRequests={sentRequests} receivedRequests={receivedRequests} friendList={friendList} />
          <TokenModal currentUser={currentUser} />
          <ReportModal currentUser={currentUser} />
          <ArticleModal currentUser={currentUser} />
          <SurveyModal currentUser={currentUser} />
          <EventModal currentUser={currentUser} />
          <Navbar currentUser={currentUser} notification={notification} />
          <IntroductionPage currentUser={currentUser} />
          <Sidebar currentUser={currentUser} />
          <div className='pb-20 pt-28'>
            {children}
          </div>
        </body>
      </ClientOnly>
    </html>
  );
}
