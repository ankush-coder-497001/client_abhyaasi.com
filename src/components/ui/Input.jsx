import { Label } from "../../aceternity-ui/label";
import { Input as InputUI } from "../../aceternity-ui/input";

const Input = ({ label, placeholder, type = "text", className, ...props }) => {
  return (
    <div className={"flex w-full flex-col space-y-2"}>
      <Label className={"text-black"} htmlFor={label}>{label}</Label>
      <InputUI id={label} placeholder={placeholder} type={type} className={className} props/>
    </div>
  );
};

export default Input;
