export const FireIcon = ({ size = 24, color = "#000000", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
    >
      <path
        fill="currentColor"
        d="M8 16c3.314 0 6-2 6-5.5c0-1.5-.5-4-2.5-6c.25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6c-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75c0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5c-.179 1-.25 2 1 3c.625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"
      ></path>
    </svg>
  );
};
