import '../../styles/Input.css';
import { IconType } from 'react-icons';

type InputProps = {
    id: string,
    placeholder: string,
    type: string,
    icon?: IconType,
    extraIcon?: IconType,
    extraIconOnclick?: () => void,
    value: string,
    onChange: (value: string) => void,
    error?: string
};

const Input = ({ id, placeholder, type, icon: Icon, extraIcon: ExtraIcon, extraIconOnclick, value, onChange, error }: InputProps) => {
    return (
      <div>
        <div className='input-container'>
            <div className='input-left-container'>
                {Icon && <Icon className='icon' size={24} color='#828282' />}
                <input id={id} autoComplete='off' value={value} type={type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
            </div>
            {ExtraIcon && <div onClick={extraIconOnclick}>
                <ExtraIcon size={24} color='#828282' />
            </div>}
            
        </div>
        {error && <div className='error-message'>{error}</div>}
      </div>
        
    );
};

export default Input;
