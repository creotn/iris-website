import QRCode from "qrcode";

/** Server-rendered QR code as a single SVG path, so it scales crisply and needs no client JS. */
export default function QrCode({ value, label }: { value: string; label: string }) {
  const { size, data } = QRCode.create(value, { errorCorrectionLevel: "M" }).modules;

  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
