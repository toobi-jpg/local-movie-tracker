export const StopWatchIcon = ({ size = 24, color = "#000000", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path d="M24 44c9.389 0 17-7.611 17-17s-7.611-17-17-17S7 17.611 7 27s7.611 17 17 17Z"></path>
        <path strokeLinecap="round" d="M18 4h12m-6 15v8m8 0h-8m0-23v4"></path>
      </g>
    </svg>
  );
};
