import { SiApplenews } from 'react-icons/si';
import { MdEventAvailable, MdOutlineReport, MdOutlineMailOutline } from 'react-icons/md';
import { RiSurveyLine } from 'react-icons/ri';
import { LuParkingCircle } from 'react-icons/lu';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { IoGitPullRequestSharp, IoNotificationsOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { FaFacebookMessenger } from 'react-icons/fa6';
import CategorySection from '../CategorySection';
import { usePathname, useSearchParams } from 'next/navigation';


export const categories = [
  {
    label: 'Announcement',
    icon: IoNotificationsOutline,
    description: "Notify important announcements" 
  },
  {
    label: 'Articles',
    icon: SiApplenews,
    description: "Follow latest articles"
  },
  {
    label: 'Events',
    icon: MdEventAvailable,
    description: "Update recent events" 
  },
  {
    label: 'Parking Lot Registration',
    icon: LuParkingCircle,
    description: 'Watch parking lot registration status'
  },
  {
    label: 'Request',
    icon: IoGitPullRequestSharp,
    description: "Request a task"
  },
  {
    label: 'Surveys',
    icon: RiSurveyLine,
    description: "Take surveys to improve dorm's quality"
  },
  {
    label: "Dorm's Rules",
    icon: HiOutlineDocumentText,
    description: "Follow strictly the dorm's rule"
  },
  {
    label: 'Reports',
    icon: MdOutlineReport,
    description: "Report violated behaviors"
  },
  {
    label: 'Messenger',
    icon: FaFacebookMessenger,
    description: "Facebook's Messenger"
  },
  {
    label: 'Contacts',
    icon: MdOutlineMailOutline,
    description: "Contact Dorm's Admin"
  },
  {
    label: 'About Dormistory',
    icon: IoInformationCircleOutline,
    description: "Dormistory's information"
  },
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();

  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }


  return (
    <div className='md:max-h-[790px] md:py-6 sm:py-2 py-4 overflow-y-auto'>
      <div className='flex flex-col items-center justify-between'>
        {categories.map((item) => (
          <CategorySection
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Categories;