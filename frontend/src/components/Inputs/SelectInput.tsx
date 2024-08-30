import { useState } from 'react';
import '../../styles/selectinput.css';

type SelectedInputProps = {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

const SelectInput = ({ options, onChange }: SelectedInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[1]);

  const handleSelect = (option: { label: string; value: string }) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div
        className="selected-option"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onBlur={() => setIsOpen(false)}
      >
        {selectedOption.label}
        <img className="arrow" src="/arrow-down.png" alt="Arrow" />
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

export default SelectInput;
