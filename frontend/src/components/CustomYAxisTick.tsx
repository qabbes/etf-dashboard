
interface Props {
  x: number;
  y: number;
  payload: {value: number};
  isMobile?: boolean; 
}

const CustomYAxisTick = ({ x, y, payload, isMobile }: Props) => {
  if (isMobile) return null; 
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="#666">
      {payload.value.toFixed(2)}
    </text>
  );
};

export default CustomYAxisTick