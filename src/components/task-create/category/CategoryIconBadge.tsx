interface CategoryIconBadgeProps {
  icon: string;
  color: string;
  size?: number;
  withBackground?: boolean;
  className?: string;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((value) => `${value}${value}`)
          .join("")
      : normalized;
  const value = Number.parseInt(expanded, 16);

  if (expanded.length !== 6 || Number.isNaN(value)) {
    return `color-mix(in srgb, ${hex} 20%, transparent)`;
  }

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function CategoryIconBadge({
  icon,
  color,
  size = 40,
  withBackground = true,
  className = "",
}: CategoryIconBadgeProps) {
  const iconSize = withBackground ? size * 0.6 : size;

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: withBackground
          ? hexToRgba(color, 0.2)
          : "transparent",
      }}
    >
      <span
        style={{
          width: iconSize,
          height: iconSize,
          backgroundColor: color,
          WebkitMaskImage: `url("${icon}")`,
          maskImage: `url("${icon}")`,
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </span>
  );
}
