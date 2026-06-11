import { useEffect, useState } from 'react';

function amsterdamTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Amsterdam',
  }).format(new Date());
}

/** Live Amsterdam clock, HH:MM. Polls every 10s so the minute never lags. */
export function LocalTime({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [time, setTime] = useState(amsterdamTime);

  useEffect(() => {
    const id = window.setInterval(() => setTime(amsterdamTime()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`tabular-nums ${className}`} style={style}>
      {time}
    </span>
  );
}
