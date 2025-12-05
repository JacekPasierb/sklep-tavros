export const TrashX = ({ size = 18, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* obrys kosza */}
      <path d="M3 6h18" />
      <path d="M8 6v-2.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 3.5V6" />
      <path d="M6 6h12l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 6z" />
  
      {/* X w środku kosza */}
      <path d="M10 11l4 4" />
      <path d="M14 11l-4 4" />
    </svg>
  );
  