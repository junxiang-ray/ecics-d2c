export interface Props {
  content: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  color?:
    | 'blue'
    | 'purple'
    | 'cyan'
    | 'green'
    | 'lightgreen'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'gray';
  font?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
}

const Badge = ({
  content,
  size,
  bordered,
  color,
  font,
}: Props): JSX.Element => {
  const badgeClr =
    color === 'lightgreen'
      ? 'text-green-700'
      : color === 'green'
        ? 'text-green-800'
        : color === 'blue'
          ? 'text-blue-800'
          : color === 'cyan'
            ? 'text-[#02ADEF]'
            : color === 'red'
              ? 'text-red-800'
              : color === 'yellow'
                ? 'text-yellow-800'
                : color === 'orange'
                  ? 'text-orange-800'
                  : color === 'gray'
                    ? 'text-gray-800'
                    : '';

  const badgeBg =
    color === 'lightgreen'
      ? 'bg-green-50'
      : color === 'green'
        ? 'bg-green-100'
        : color === 'blue'
          ? 'bg-blue-100 '
          : color === 'cyan'
            ? 'bg-[#02ADEF]/10'
            : color === 'red'
              ? 'bg-red-100'
              : color === 'yellow'
                ? 'bg-yellow-100'
                : color === 'orange'
                  ? 'bg-orange-100'
                  : color === 'gray'
                    ? 'bg-gray-100'
                    : 'bg-[currentColor] opacity-10';

  const badgeBorder =
    color === 'lightgreen'
      ? 'border-green-200'
      : color === 'green'
        ? 'border-green-200'
        : color === 'blue'
          ? 'border-blue-200 '
          : color === 'cyan'
            ? 'border-[#02ADEF]'
            : color === 'red'
              ? 'border-red-200'
              : color === 'yellow'
                ? 'border-yellow-200'
                : color === 'orange'
                  ? 'border-orange-200'
                  : color === 'gray'
                    ? 'border-gray-200'
                    : 'border-[currentColor] opacity-20';

  const badgeSize =
    size === 'sm'
      ? 'h-[19.5px] px-[7px]'
      : size === 'lg'
        ? 'h-[26.5px] px-[10.5px]'
        : 'h-[21px] px-[7px]';

  return (
    <span
      className={`border-box relative grid h-fit w-fit items-center ${badgeClr} ${badgeSize}`}
    >
      <span className={`absolute inset-0 z-0 rounded-full ${badgeBg}`} />
      {bordered && (
        <span
          className={`z-1 absolute inset-0 rounded-full border ${badgeBorder}`}
        />
      )}
      <span
        className={`z-2 relative inline-block text-nowrap font-body text-[10.5px] leading-none font-${font ?? 'normal'}`}
      >
        {content}
      </span>
    </span>
  );
};
export default Badge;
