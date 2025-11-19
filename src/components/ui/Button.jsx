import './button.css';


export default function Button({
  type,
  isLoading = false,
  children,
  onClick,
}) {
  return (
    <button
      type={type}
      className="premium-button"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="button-loader">
          <span className="loader-dot"></span>
          <span className="loader-dot"></span>
          <span className="loader-dot"></span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
