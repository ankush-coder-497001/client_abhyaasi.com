import { Button as AceternityButton } from "../../aceternity-ui/moving-border";

function Button({
  className = "",
  children = "",
  borderRadius = "1.75rem",
  ...otherProps
}) {
  return (
    <div>
      <AceternityButton
        borderRadius={borderRadius}
        className={`cursor-pointer ${className}`}
        {...otherProps}
      >
        {children}
      </AceternityButton>
    </div>
  );
}

export default Button;
