interface NumNumLogoProps {
  size?: number;
  className?: string;
}

export function NumNumLogo({ size = 64, className = '' }: NumNumLogoProps) {
  // Scale the icon elements based on size
  const iconSize = size;
  const padding = size * 0.2; // 20% padding
  const innerSize = size - padding * 2; // 60% of container
  const borderRadius = size * 0.25; // 25% of size for rounded corners (16px at 64px)

  // Chopsticks configuration
  const chopstickLength = innerSize * 0.85;
  const chopstickSpread = innerSize * 0.25; // horizontal spread at top
  const strokeWidth = size * 0.047; // ~3px at 64px size

  // Calculate chopstick positions (centered, diagonal)
  const centerX = size / 2;
  const startY = padding;
  const endY = startY + chopstickLength;

  // Left chopstick (angled outward at top)
  const leftTop = { x: centerX - chopstickSpread / 2, y: startY };
  const leftBottom = { x: centerX - chopstickSpread / 4, y: endY };

  // Right chopstick (angled outward at top)
  const rightTop = { x: centerX + chopstickSpread / 2, y: startY };
  const rightBottom = { x: centerX + chopstickSpread / 4, y: endY };

  // Star position (between chopstick tips at top)
  const starX = centerX;
  const starY = startY + size * 0.08;
  const starSize = size * 0.16; // Star size scales with container

  return (
    <div
      className={`bg-[#E8603C] flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Chopstick */}
        <line
          x1={leftTop.x}
          y1={leftTop.y}
          x2={leftBottom.x}
          y2={leftBottom.y}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Right Chopstick */}
        <line
          x1={rightTop.x}
          y1={rightTop.y}
          x2={rightBottom.x}
          y2={rightBottom.y}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Star/Sparkle between chopstick tips */}
        <g transform={`translate(${starX}, ${starY})`}>
          {/* 4-pointed star (sparkle shape) */}
          <path
            d={`
              M 0 ${-starSize / 2}
              L ${starSize / 8} ${-starSize / 8}
              L ${starSize / 2} 0
              L ${starSize / 8} ${starSize / 8}
              L 0 ${starSize / 2}
              L ${-starSize / 8} ${starSize / 8}
              L ${-starSize / 2} 0
              L ${-starSize / 8} ${-starSize / 8}
              Z
            `}
            fill="white"
          />
        </g>
      </svg>
    </div>
  );
}

/** Smaller version for attribution / compact headers */
export function NumNumLogoSmall({ className = '' }: { className?: string }) {
  return <NumNumLogo size={24} className={className} />;
}
