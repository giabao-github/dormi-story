"use client";

import { TbLogout } from 'react-icons/tb';
import { MdOutlineToken, MdOutlineReport, MdEventAvailable } from 'react-icons/md';
import { BiNews } from 'react-icons/bi';
import { IconType } from 'react-icons';

interface MenuItemProps {
  onClick?: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  const truncatedLabel = label.length > 18 ? `${label.slice(0, 18)}...` : label;

  let Icon: IconType | null = null;;

  if (label === 'Log out') {
    Icon = TbLogout;
  } else if (label === 'Make A Report') {
    Icon = MdOutlineReport;
  } else if (label === 'Messenger Token') {
    Icon = MdOutlineToken;
  } else if (label === 'Post An Article') {
    Icon = BiNews;
  } else if (label === 'Create An Event') {
    Icon = MdEventAvailable;
  }

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className='px-4 py-3 hover:bg-neutral-100 transition font-semibold text-base flex flex-row'
      >
        {Icon && <Icon size={24} className='mr-3' />}
        {label}
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