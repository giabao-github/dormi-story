import getCurrentUser from '../actions/getCurrentUser';


export default async function Home() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div></div>
  );
}