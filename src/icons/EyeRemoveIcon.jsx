export const EyeRemoveIcon = ({ size = 24, color = "#000000", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={size}
      height={size}
      className={className}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.23 6.33a1 1 0 0 1 0 1.34C12.18 8.8 9.79 11 7 11S1.82 8.8.77 7.67a1 1 0 0 1 0-1.34C1.82 5.2 4.21 3 7 3s5.18 2.2 6.23 3.33Z"></path>
        <circle cx="7" cy="7" r="2"></circle>
      </g>
      <line
        x1="0"
        y1="0"
        x2="14"
        y2="14"
        stroke="red"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
