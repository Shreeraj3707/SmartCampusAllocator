export default function Alert({ type, text }) {
  if (!text) return null;
  return <div className={`alert ${type}`}>{text}</div>;
}