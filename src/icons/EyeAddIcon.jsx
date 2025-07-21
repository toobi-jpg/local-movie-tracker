export const EyeAddIcon = ({
  size = 24,
  checkColor = "#00ff44",
  color = "#000000",
  className,
}) => {
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
        <path
          stroke={checkColor}
          d="m4.5 7.25l1.55 1.14a.48.48 0 0 0 .4.1a.5.5 0 0 0 .34-.24l3.71-6"
        ></path>
        <path d="M11.85 5.25a13.92 13.92 0 0 1 1.65 2s-2.91 4.5-6.5 4.5S.5 7.25.5 7.25s2.91-4.5 6.5-4.5"></path>
      </g>
    </svg>
  );
};
