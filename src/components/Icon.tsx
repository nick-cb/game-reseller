const Icons = {
  media: [
    'play',
    'pause',
    'volume-down',
    'volume-mute',
    'volume-up',
    'fullscreen',
    'fullscreen-exit',
  ] as const,
  arrow: [
    'arrow-right-s',
    'arrow-left-s',
    'arrow-down-circle',
    'arrow-down',
    'arrow-down-s',
  ] as const,
};
type IconKeys = keyof typeof Icons;
type IconNames = (typeof Icons)[IconKeys][number];
type ExtractKeyByValue<V> = {
  [K in IconKeys]: V extends (typeof Icons)[K][number] ? K : never;
}[keyof typeof Icons];
type IconProps<T extends IconNames> = {
  name: T;
  variant?: 'fill' | 'line';
  category?: ExtractKeyByValue<T>;
  size?: number;
};

export function Icon<T extends IconNames>({
  name,
  variant = 'fill',
  category,
  width,
  height,
  size = 24,
  ...props
}: JSX.IntrinsicElements['svg'] & IconProps<T>) {
  const iconWidth = width ?? size ?? 24;
  const iconHeight = height ?? size ?? 24;

  const cat =
    category || Object.keys(Icons).find((key) => (Icons[key as IconKeys] as any).includes(name));
  return (
    <svg width={iconWidth} height={iconHeight} {...props}>
      <use xlinkHref={`/svg/remixicon.${cat}.svg#${'ri-' + name + '-' + variant}`} />
    </svg>
  );
}
