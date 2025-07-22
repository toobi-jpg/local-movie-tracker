import { useState } from "react";

export default function Dropdown({
  data,
  options,
  onSelect,
  placeholder = "Select an option",
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div id="dropdown-container" className={`${className}`}>
      <div className="relative">
        <button
          id="dropdown-toggle"
          className=" bg-black/60 backdrop-blur-lg cursor-pointer
          rounded border border-white/5 px-1 py-1 text-xs"
          onClick={handleToggle}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>
        {isOpen && (
          <ul
            className="dropdown-menu"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "#fff",
              listStyle: "none",
              padding: 0,
              margin: "5px 0 0 0",
              zIndex: 10,
            }}
          >
            {options?.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  "&:hover": { background: "#f0f0f0" },
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
