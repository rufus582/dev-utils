import { motion, type SpringOptions, useMotionValue, useSpring } from "motion/react";
import { useEffect, useEffectEvent } from "react";

interface TiltContainerProps {
  rotateX?: number;
  rotateY?: number;
  rotate?: number;
  className?: string;
  children: React.ReactNode;
  springOptions?: SpringOptions;
}

const TiltContainer = ({ springOptions, ...props }: TiltContainerProps) => {
  const rotateXAngle = props.rotateX ?? props.rotate ?? 15;
  const rotateYAngle = props.rotateY ?? props.rotate ?? 15;

  const rotateX = useSpring(useMotionValue(0), springOptions);
  const rotateY = useSpring(useMotionValue(0), springOptions);

  const handleMouseMove = useEffectEvent((e: MouseEvent) => {
    const offsetX = e.clientX - window.innerWidth / 2;
    const offsetY = e.clientY - window.innerHeight / 2;

    const rotationX = (offsetY / (window.innerHeight / 2)) * -rotateXAngle;
    const rotationY = (offsetX / (window.innerWidth / 2)) * rotateYAngle;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  });

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={props.className}
    >
      {props.children}
    </motion.div>
  );
};

export default TiltContainer;
