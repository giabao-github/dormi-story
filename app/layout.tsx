import './globals.css';
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';
import Sidebar from './components/sidebar/Sidebar';
import IntroductionPage from './components/IntroductionPage';


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
        <body>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
          <IntroductionPage currentUser={currentUser} />
          <Sidebar currentUser={currentUser} />
          {children}
        </body>
      </ClientOnly>
    </html>
  );
}
