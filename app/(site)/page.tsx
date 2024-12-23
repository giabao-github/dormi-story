import getCurrentUser from '../actions/getCurrentUser';
import PageContent from './components/PageContent';


export default async function Home() {
  const currentUser = await getCurrentUser();
  return (
    <PageContent />
  );
}