import { Link } from 'react-router-dom';

function Logo({ variant = 'default', linkTo = '/' }) {
  const colorClasses = {
    default: 'text-primary-800',
    light: 'text-white',
    dark: 'text-gray-900',
  };

  return (
    <Link to={linkTo} className={`flex items-center gap-2 font-bold text-xl ${colorClasses[variant]}`}>
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
        />
      </svg>
      <span className="tracking-wide">TICKETPLAZA</span>
    </Link>
  );
}

export default Logo;