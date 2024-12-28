"use client";

import { TbLogout } from 'react-icons/tb';
import { MdOutlineToken, MdOutlineReport, MdEventAvailable } from 'react-icons/md';
import { BiNews } from 'react-icons/bi';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { RiSurveyLine } from 'react-icons/ri';
import { FaRegHandshake } from 'react-icons/fa6';
import { BsBuildingAdd } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface MenuItemProps {
  onClick?: () => void;
  label: string;
  notification?: number | null;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, notification }) => {
  const truncatedLabel = label.length > 18 ? `${label.slice(0, 18)}...` : label;

  let Icon: IconType | null = null;;

  if (label === 'Log out') {
    Icon = TbLogout;
  } else if (label === 'Edit Profile') {
    Icon = HiOutlineUserCircle;
  } else if (label === 'Submit A Report') {
    Icon = MdOutlineReport;
  } else if (label === 'Friend Requests') {
    Icon = FaRegHandshake;
  } else if (label === 'Post An Article') {
    Icon = BiNews;
  } else if (label === 'Schedule An Event') {
    Icon = MdEventAvailable;
  } else if (label === 'Create A Survey') {
    Icon = RiSurveyLine;
  } else if (label === 'Create A Building') {
    Icon = BsBuildingAdd;
  }

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={`${label === 'Edit Profile' ? 'px-[13px]' : 'px-3'} py-3 hover:bg-neutral-100 transition font-semibold text-base flex items-center justify-between`}
      >
        <div className='flex flex-row gap-3'>
          {Icon && <Icon size={24} />}
          {label}
        </div>
        <div className='flex justify-end'>
          {typeof notification === 'number' && notification > 0 && (
            <div className='rounded-full h-[26px] w-[26px] bg-button p-1 flex items-center justify-center ml-auto'>
              <p className='text-white text-[11px]'>
                {notification}
                {notification > 99 && (
                  <span className='align-super text-[8px]'>+</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className='px-4 py-3 font-semibold text-sm'
      >
        {truncatedLabel}
      </div>
    );
  }
}

export default MenuItem;