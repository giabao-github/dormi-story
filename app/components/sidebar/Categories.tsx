"use client";

import { BiNews } from 'react-icons/bi';
import { MdEventAvailable, MdOutlineReport, MdOutlineMailOutline,  MdOutlineGrade } from 'react-icons/md';
import { RiSurveyLine, RiMessengerLine } from 'react-icons/ri';
import { LuParkingCircle } from 'react-icons/lu';
import { HiOutlineWrench } from 'react-icons/hi2';
import { IoNotificationsOutline, IoImageOutline } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaRegAddressCard, FaWpforms, FaScaleBalanced  } from 'react-icons/fa6';
import CategorySection from '../CategorySection';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export const categories = [
  {
    label: 'Announcement',
    route: '/announcement',
    icon: IoNotificationsOutline,
    description: "Notify important announcements" 
  },
  {
    label: 'Personal Information',
    route: '/personal%20information',
    icon: FaRegUserCircle,
    description: "Student personal information" 
  },
  {
    label: 'Behavior Points',
    route: '/behavior%20points',
    icon: MdOutlineGrade,
    description: "Student's behavior points" 
  },
  {
    label: 'Medical Insurance',
    route: '/medical%20insurance',
    icon: FaRegAddressCard,
    description: "Declare medical insurance" 
  },
  {
    label: 'Parking Lot Registration',
    route: '/parking%20lot%20registration',
    icon: LuParkingCircle,
    description: "Parking lot registration" 
  },
  {
    label: 'Articles',
    route: '/articles',
    icon: BiNews,
    description: "Follow latest articles"
  },
  {
    label: 'Events',
    route: '/events',
    icon: MdEventAvailable,
    description: "Update recent events" 
  },
  {
    label: 'Request',
    route: '/request',
    icon: HiOutlineWrench,
    description: "Request a task"
  },
  {
    label: 'Surveys',
    route: '/surveys',
    icon: RiSurveyLine,
    description: "Take surveys to improve dorm's quality"
  },
  {
    label: 'Forms',
    route: '/forms',
    icon: FaWpforms,
    description: "Form's templates"
  },
  {
    label: "Dorm's Rules",
    route: '/rules',
    icon: FaScaleBalanced,
    description: "Follow strictly the dorm's rule"
  },
  {
    label: 'Reports',
    route: '/reports',
    icon: MdOutlineReport,
    description: "Report violated behaviors"
  },
  {
    label: 'Messenger',
    route: '/messenger',
    secondRoute: '/conversations',
    childRoute: '/conversations/',
    icon: RiMessengerLine,
    description: "Facebook's Messenger"
  },
  {
    label: 'Pictures',
    route: '/pictures',
    icon: IoImageOutline,
    description: "Dorm's Pictures"
  },
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();

  const isMainPage = (
    pathname === '/' || 
    pathname === '/articles' || 
    pathname?.includes('/articles/') ||
    pathname === '/messenger' ||
    pathname === '/conversations' ||
    pathname?.includes('/conversations/') ||
    pathname === '/surveys' ||
    pathname === '/rules'
  );

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
            route={item.route}
            selected={
              category === item.label || 
              (
                item.childRoute ? 
                pathname?.includes(item.childRoute) || pathname === item.route || pathname === item.secondRoute : 
                pathname === item.route
              )
            }
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Categories;