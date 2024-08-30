import { useState } from 'react';
import Select, { SingleValue, components } from 'react-select';

export type OptionType = {
  label: string;
  value: string;
};

type AssignToInputProps = {
  options: OptionType[];
  onSelect: (selectedOption: OptionType) => void;
  value?: OptionType | null | undefined;
  isDisabled?: boolean; 
};


const getProfileLetters = (email: string) => {
  const [firstLetter, secondLetter] = email.split('@')[0];
  return `${firstLetter.toUpperCase()}${secondLetter.toUpperCase()}`;
};

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps } = props;
  const profileLetters = getProfileLetters(data.label);

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: 'white',
        fontFamily: 'Inter',
        fontSize: 'small',
        fontWeight: 500,
      }}
    >
      <div
        style={{
          marginRight: '8px',
          backgroundColor: '#FFEBEB',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'small',
          fontFamily: 'DM Sans',
          fontWeight: 500,
        }}
      >
        {profileLetters}
      </div>
      <div style={{ flexGrow: 1 }}>{data.label}</div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          props.selectOption(data);
        }}
        style={{
          marginLeft: '8px',
          backgroundColor: 'white',
          color: '#767575',
          border: '1px solid #E2E2E2',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Assign
      </div>
    </div>
  );
};

// Custom no options message component
const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span style={{ fontFamily: 'Inter', fontSize: 'small', fontWeight: 500 }}>
        No person added to board
      </span>
    </components.NoOptionsMessage>
  );
};

const AssignToInput: React.FC<AssignToInputProps> = ({ options, onSelect, value, isDisabled }) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null | undefined>(value);

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedOption(selectedOption);
    onSelect(selectedOption as OptionType);
  };

  return (
    <div style={{ width: '100%' }}>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        components={{ Option: CustomOption, NoOptionsMessage }}
        placeholder="Add an assignee"
        styles={{
          control: (provided) => ({
            ...provided,
            width: '100%',
            cursor: 'pointer',
            boxShadow: 'none',
            '&:focus': {
              outline: 'none',
              borderColor: 'black',
              boxShadow: 'none',
            },
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 2000,
            width: '100%',
            maxHeight: '160px', // Limit the menu height
            overflowY: 'auto', // Enable vertical scrolling
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 2000,
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'white' : 'white',
            '&:hover': {
              backgroundColor: 'white',
            },
          }),
        }}
        menuPortalTarget={document.body}
        isDisabled={isDisabled} // Set isDisabled prop
      />
    </div>
  );
};

export default AssignToInput;
