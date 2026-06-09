export default function SpaceBackground() {
  return (
    <div className="space-background pointer-events-none fixed inset-0 -z-10">
      <div className="stars" />
      <div className="stars stars-2" />
      <div className="stars stars-3" />

      <span className="meteor meteor-1" />
      <span className="meteor meteor-2" />
      <span className="meteor meteor-3" />
      <span className="meteor meteor-4" />
    </div>
  );
}