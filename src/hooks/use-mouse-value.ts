import { useMotionValue, useSpring, type SpringOptions } from "motion/react";

interface UseMouseValueProps {
  springOptions?: SpringOptions;
}

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 30,
};

const useMouseValue = (props?: UseMouseValueProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, props?.springOptions || DEFAULT_SPRING_OPTIONS);
  const springY = useSpring(y, props?.springOptions || DEFAULT_SPRING_OPTIONS);

  const handleMouseMove = (event: MouseEvent) => {
    springX.set(event.clientX);
    springY.set(event.clientY);
  };

  const resetMouse = () => {
    springX.set(0);
    springY.set(0);
  };

  return { x: springX, y: springY, handleMouseMove, resetMouse };
};

export default useMouseValue;
