export const NoCameraIcon = ({ size = 24, color = "#000000", className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill={color}
        d="m17.525 15l-2.175-1.25l3.5-2.6L21 12.4zM12.8 11.95l2.6-1.975L8.5 6L7 8.6zM4 20v-2h5v-5.95l-3-1.725q-.725-.425-.937-1.212T5.275 7.6l1.5-2.6q.425-.725 1.213-.937t1.512.212l9.525 5.5l-6.1 4.55l-1.925-1.1V18q0 .825-.588 1.413T9 20z"
      ></path>
      <line x1="24" y1="0" x2="0" y2="24" stroke={color} strokeWidth="2" />
    </svg>
  );
};
