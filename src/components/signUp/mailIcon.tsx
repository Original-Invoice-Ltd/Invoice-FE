const MailIcon = ({ width = 20, height = 20, className = "" }: { width?: number; height?: number; className?: string }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 6.66666L8.50929 8.4213C9.44771 8.89051 10.5523 8.89051 11.4907 8.4213L15 6.66666M5 15.8333H15C16.3807 15.8333 17.5 14.714 17.5 13.3333V6.66666C17.5 5.28594 16.3807 4.16666 15 4.16666H5C3.61929 4.16666 2.5 5.28594 2.5 6.66666V13.3333C2.5 14.714 3.61929 15.8333 5 15.8333Z"
        stroke="#333436"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MailIcon;
