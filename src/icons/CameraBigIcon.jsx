const CameraBigIcon = ({ size = 24, color = "#000000", className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill={color}
        d="M248 136a8 8 0 0 0-8 8v16h-44.69L177 141.66l50.34-50.35a16 16 0 0 0 0-22.62l-56-56a16 16 0 0 0-22.63 0L2.92 158.94A10 10 0 0 0 10 176h39.37l35.32 35.31a16 16 0 0 0 22.62 0L165.66 153L184 171.31a15.86 15.86 0 0 0 11.31 4.69H240v16a8 8 0 0 0 16 0v-48a8 8 0 0 0-8-8M160 24l12.69 12.69L49.37 160H24.46ZM96 200l-32-32L184 48l32 32Z"
      ></path>
    </svg>
  );
};

export default CameraBigIcon;
