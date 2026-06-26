export function NivaLogo({ size = 32, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} className={className}>
      <path d="M18,56 L18,28 Q18,10 32,10 Q46,10 46,28 L46,56 L38,56 L38,28 Q38,22 32,22 Q26,22 26,28 L26,56 Z" fill="#1D2420"/>
      <path d="M18,40 Q20,34 26,38 L26,56 L18,56 Q14,56 14,52 L14,44 Q14,40 18,40 Z" fill="#B2CBB6"/>
    </svg>
  );
}

export function NivaWordmark({ className = '' }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      Niva<span style={{ color: '#8FBC8F' }}>Ops</span>
    </span>
  );
}
