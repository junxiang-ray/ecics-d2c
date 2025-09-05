import { PanInfo, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

export function useBottomSheet(isOpen: boolean, onClose: () => void) {
  const controls = useAnimationControls();

  const open = () => {
    controls.start({
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.25,
      },
    });
  };

  const close = () => {
    controls
      .start({
        y: '100%',
        transition: {
          type: 'spring',
          damping: 35,
          stiffness: 200,
          duration: 0.45,
        },
      })
      .then(() => {
        onClose();
      });
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    // Pull down to close.
    if (info.offset.y > 0 && (info.offset.y > 100 || info.velocity.y > 500)) {
      close(); // Pull down far or fast enough to close.
    } else {
      open(); // Scroll up, or if insufficient, return to the open position.
    }
  };

  useEffect(() => {
    if (isOpen) open();
    else close();
  }, [isOpen]);

  return {
    controls,
    sheetProps: {
      initial: { y: '100%' },
      drag: 'y' as const,
      dragElastic: 0.2,
      dragMomentum: false,
      onDragEnd: handleDragEnd,
      dragConstraints: { top: 0, bottom: window.innerHeight }, // Do not allow scrolling up
    },
  };
}
