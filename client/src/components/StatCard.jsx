export default function StatCard({ number, label }) {
  return (
    <div className="stat-card">
      <div className="number">{number}</div>
      <div className="label">{label}</div>
    </div>
  );
}