const SidebarToggleIcon = () => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        id="rect2"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        x="2"
        y="2"
        rx="3.3952649"
      />
      <rect
        id="rect3"
        fill="currentColor"
        x="5"
        y="5"
        data-slot="sidebar-state"
        className={`transition-all duration-300 origin-[20%] w-1.75 h-3.5 [rx:2px]`}
      />
    </svg>
  );
};

export default SidebarToggleIcon;
