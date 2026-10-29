import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article";
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </Component>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}
