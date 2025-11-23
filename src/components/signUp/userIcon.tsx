const UserIcon = ({ width = 14, height = 17, className = "" }: { width?: number; height?: number; className?: string }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.25 9.91667H4.91667C2.61548 9.91667 0.75 11.7821 0.75 14.0833V14.9167C0.75 15.3769 1.1231 15.75 1.58333 15.75H11.5833C12.0436 15.75 12.4167 15.3769 12.4167 14.9167V14.0833C12.4167 11.7821 10.5512 9.91667 8.25 9.91667Z"
        stroke="#333436"
        strokeWidth="1.5"
      />
      <path
        d="M6.58333 7.41667C8.42428 7.41667 9.91667 5.92428 9.91667 4.08333C9.91667 2.24238 8.42428 0.75 6.58333 0.75C4.74238 0.75 3.25 2.24238 3.25 4.08333C3.25 5.92428 4.74238 7.41667 6.58333 7.41667Z"
        stroke="#333436"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default UserIcon;
