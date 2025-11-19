interface Props {
  icon: JSX.Element;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  className?: string;
}

const BoxIcon = ({ className, icon, bordered, size }: Props): JSX.Element => {
  const boxSize =
    size === 'lg' ? 'w-[49px]' : size === 'sm' ? 'w-[28px]' : 'w-[42px]';

  return (
    <div
      className={`relative grid aspect-square place-items-center ${boxSize} ${className ?? ''}`}
    >
      <div
        className={`transition-background absolute inset-0 z-0  bg-[currentColor] opacity-10 duration-200 group-hover:opacity-20 ${
          size === 'sm' ? 'rounded-lg' : 'rounded-xl'
        }`}
      />
      {bordered && (
        <div
          className={`z-1 absolute inset-0 border border-[currentColor] opacity-20 ${
            size === 'sm' ? 'rounded-lg' : 'rounded-xl'
          }`}
        />
      )}
      <span className='z-2 relative'>{icon}</span>
    </div>
  );
};
export default BoxIcon;
