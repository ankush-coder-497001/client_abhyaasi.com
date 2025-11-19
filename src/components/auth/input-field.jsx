import './input-field.css';



export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  label,
  name,
  required,
  maxLength,
}) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        maxLength={maxLength}
        className="input-field"
      />
      <div className="input-focus-line"></div>
    </div>
  );
}
