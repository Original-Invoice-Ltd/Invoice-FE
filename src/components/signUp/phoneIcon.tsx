interface PhoneIconProps {
  width?: number;
  height?: number;
}

export default function PhoneIcon({ width = 20, height = 20 }: PhoneIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M18.3 15.13L15.13 11.96C14.61 11.44 13.75 11.44 13.23 11.96L11.96 13.23C11.44 13.75 10.58 13.75 10.06 13.23L6.77 9.94C6.25 9.42 6.25 8.56 6.77 8.04L8.04 6.77C8.56 6.25 8.56 5.39 8.04 4.87L4.87 1.7C4.35 1.18 3.49 1.18 2.97 1.7L1.7 2.97C0.64 4.03 0.64 5.77 1.7 6.83L13.17 18.3C14.23 19.36 15.97 19.36 17.03 18.3L18.3 17.03C18.82 16.51 18.82 15.65 18.3 15.13Z" 
        stroke="#666666" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}