import useMouseValue from "@/hooks/use-mouse-value";
import { motion, useTransform, type SpringOptions } from "motion/react";
import { useEffect } from "react";

interface TiltContainerProps {
  rotateX?: number;
  rotateY?: number;
  rotate?: number;
  children: React.ReactNode;
  springOptions?: SpringOptions;
}

const TiltContainer = ({ springOptions, ...props }: TiltContainerProps) => {
  const { x, y, handleMouseMove } = useMouseValue({ springOptions });

  const rotateXAngle = `${props.rotateX ?? props.rotate ?? 15}deg`;
  const rotateYAngle = `${props.rotateY ?? props.rotate ?? 15}deg`;

  // Transform mouse position into rotation degrees
  const rotateX = useTransform(
    y,
    [0, window.innerHeight],
    [rotateXAngle, "-" + rotateXAngle]
  );
  const rotateY = useTransform(
    x,
    [0, window.innerWidth],
    ["-" + rotateYAngle, rotateYAngle]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
      {props.children}
    </motion.div>
  );
};

export default TiltContainer;
