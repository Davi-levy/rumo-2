import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export function RevealText({ text, className, delay = 0 }: Props) {
  const letters = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : "normal" }}
          aria-hidden
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
