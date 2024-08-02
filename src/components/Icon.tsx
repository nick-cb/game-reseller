import { mergeCls } from '@/utils';

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
  business: [
    'mail-add',
    'mail-check',
    'mail-close',
    'mail-download',
    'mail',
    'mail-forbid',
    'mail-lock',
    'mail-open',
    'mail-send',
    'mail-settings',
    'mail-star',
    'mail-unread',
    'mail-volume',
  ] as const,
  system: [
    'lock-password',
    'eye',
    'eye-off',
    'check',
    'loader-4',
    'star',
    'star-s',
    'star-half',
    'star-half-s',
    'star-smile',
  ] as const,
  user: ['user', 'robot', 'robot-2'] as const,
  design: ['shapes'] as const,
};

type IconKeys = keyof typeof Icons;
type IconNames = (typeof Icons)[IconKeys][number];
type ExtractKeyByValue<V> = {
  [K in IconKeys]: V extends (typeof Icons)[K][number] ? K : never;
}[keyof typeof Icons];

type IconProps<T extends IconNames> = JSX.IntrinsicElements['svg'] & {
  name: T;
  variant?: 'fill' | 'line';
  category?: ExtractKeyByValue<T>;
  size?: number;
};
export function Icon<T extends IconNames>(props: IconProps<T>) {
  const {
    name,
    variant = 'line',
    category,
    width,
    height,
    size = 20,
    fill = 'white',
    className,
    ...rest
  } = props;
  const iconWidth = width ?? size ?? 20;
  const iconHeight = height ?? size ?? 20;

  const cat =
    category || Object.keys(Icons).find((key) => (Icons[key as IconKeys] as any).includes(name));
  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      fill={fill}
      className={mergeCls('flex-shrink-0', className)}
      version="1.1"
      {...rest}
    >
      <use
        xlinkHref={`/svg/remixicon.${cat}.svg#${'ri-' + name + '-' + variant}`}
      />
    </svg>
  );
}
