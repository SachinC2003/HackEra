
interface CustomLabelProps {
  title: string;
  required?: boolean;
}

const CustomLabel: React.FC<CustomLabelProps> = ({ title, required = false }) => {
  return (
    <label>
      {title} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
  );
};

export default CustomLabel;
