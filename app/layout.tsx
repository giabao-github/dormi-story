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

  return (
    <html lang='en'>
      <title>Dormistory | Home Page</title>
      <ClientOnly>
        <body className={`overflow-hidden ${nunito.className}`}>
          <ToasterProvider />
          <ActiveStatus />
          <LoginModal />
          <RegisterModal />
          <TokenModal currentUser={currentUser} />
          <ReportModal currentUser={currentUser} />
          <ArticleModal currentUser={currentUser} />
          <SurveyModal currentUser={currentUser} />
          <EventModal currentUser={currentUser} />
          <Navbar currentUser={currentUser} />
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
