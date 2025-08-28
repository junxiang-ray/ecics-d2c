import { useCallback, useEffect, useState } from 'react';

export const useHandlePosition = (
  isOpen: boolean,
  wrapperRef: React.RefObject<HTMLElement>,
) => {
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
    'down',
  );

  const handlePosition = useCallback(() => {
    if (!isOpen || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const newDirection =
      spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropdownDirection(newDirection);
  }, [isOpen, wrapperRef]);

  useEffect(() => {
    if (!isOpen) return;

    handlePosition();
    window.addEventListener('scroll', handlePosition, true);
    window.addEventListener('resize', handlePosition);

    return () => {
      window.removeEventListener('scroll', handlePosition, true);
      window.removeEventListener('resize', handlePosition);
    };
  }, [isOpen, handlePosition]);

  return { dropdownDirection, handlePosition };
};
