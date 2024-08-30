import { useState } from 'react';
import '../../styles/selectinput.css';

type CardOptionsProps = {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

const CardOptions = ({ options, onChange }: CardOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: { label: string; value: string }) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div
        className="selected-option flex align-center"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onBlur={() => setIsOpen(false)}
      >
        . . .
      </div>
      {isOpen && (
        <div className="options" onMouseDown={(e) => e.preventDefault()}>
          {options.map((option, index) => (
            <div
              key={index}
              className="option"
              onMouseDown={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardOptions;
