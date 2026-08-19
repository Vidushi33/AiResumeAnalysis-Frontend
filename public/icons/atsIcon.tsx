interface IProps {
  width: string;
  height: string;
  style?: React.CSSProperties;
}

export default function AtsIcon({ height, width, style }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={style}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
