import './AnimatedBg.css';

export default function AnimatedBg({ color = '#6C63FF', count = 10 }) {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="abg-blob abg-1" style={{ background: color }} />
      <div className="abg-blob abg-2" style={{ background: '#FF6584' }} />
      <div className="abg-blob abg-3" style={{ background: '#43E97B' }} />
      <div className="abg-grid" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="abg-sparkle" style={{ '--si': i, '--sc': `hsl(${(i * 36 + 240) % 360},80%,70%)` }} />
      ))}
      <div className="abg-ring abg-ring1" style={{ borderColor: `${color}18` }} />
      <div className="abg-ring abg-ring2" style={{ borderColor: `${color}0d` }} />
    </div>
  );
}
