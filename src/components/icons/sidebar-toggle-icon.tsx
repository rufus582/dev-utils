const SidebarToggleIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className="group"
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
        width="7"
        height="14"
        fill="currentColor"
        x="5"
        y="5"
        rx="2"
        ry="2"
        className={`transition-transform duration-300 origin-[20%] ${
          isOpen
            ? "scale-x-100 group-hover:scale-x-[0.3]"
            : "scale-x-[0.3] group-hover:scale-x-100"
        }`}
      />
    </svg>
  );
};

export default SidebarToggleIcon;
