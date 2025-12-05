interface LoopContainerProps {
  readonly items: React.ReactNode[];
  readonly duration?: number; // animation duration in seconds
  readonly gap?: number; // gap between items in pixels
  readonly repetitions?: number; // how many times to duplicate the items (minimum 2)
}

export default function LoopContainer({
  items,
  duration = 20,
  gap = 24,
  repetitions = 2,
}: LoopContainerProps) {
  // Ensure minimum 2 repetitions
  const actualRepetitions = Math.max(2, repetitions);

  return (
    <div className="w-full overflow-hidden group">
      <div
        className="flex animate-loop group-hover:[animation-play-state:paused]"
        style={
          {
            gap: `${gap}px`,
            '--loop-duration': `${duration}s`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: actualRepetitions }).map((_, setIndex) => (
          <div
            key={`set-${setIndex + 1}`}
            className="flex shrink-0"
            style={{ gap: `${gap}px` }}
          >
            {items.map((item, itemIndex) => (
              <div key={`item-${setIndex}-${itemIndex}`} className="shrink-0">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
