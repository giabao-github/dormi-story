"use client";

interface MenuItemProps {
  onClick?: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  const truncatedLabel = label.length > 18 ? `${label.slice(0, 18)}...` : label;

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className='px-4 py-3 hover:bg-neutral-100 transition font-semibold text-base'
      >
        {label}
      </div>
    );
  } else {
    return (
      <div
        className='px-4 py-3 font-medium text-sm'
      >
        {truncatedLabel}
      </div>
    );
  }
}

export default MenuItem;