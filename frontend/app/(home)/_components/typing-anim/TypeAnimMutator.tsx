"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export default function TypeAnimMutator({
  baseText,
  texts,
  delay,
}: {
  baseText: string;
  texts: string[];
  delay: number;
}) {
  const scrambleIndexList = (length: number) => {
    const list = [];
    for (let i = 0; i < length; i++) {
      list.push(i);
    }
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * length);
      const temp: number = list[i];
      list[i] = list[randomIndex];
      list[randomIndex] = temp;
    }
    return list;
  };

  // Random list of indexes of text to show
  // Ensures there are no repeats until list is exhausted
  let indexList = scrambleIndexList(texts.length);

  const textIndex = useMotionValue(0);
  const count = useMotionValue(0);

  // Full text to show
  const fullText = useTransform(
    textIndex,
    (latest) => baseText + texts[indexList[latest]] + "." || "",
  );

  // Count of characters to show
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    fullText.get().slice(0, baseText.length + latest),
  );
  const updatedThisRound = useMotionValue(true);

  useEffect(() => {
    animate(count, 100, {
      type: "tween",
      delay: delay,
      duration: 2,
      ease: "easeIn",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 1,
      onUpdate(latest) {
        if (updatedThisRound.get() === true && latest > 0) {
          updatedThisRound.set(false);
        } else if (updatedThisRound.get() === false && latest === 0) {
          // Update which text in texts to show
          if (textIndex.get() === texts.length - 1) {
            textIndex.set(0);
            indexList = scrambleIndexList(texts.length);
          } else {
            textIndex.set(textIndex.get() + 1);
          }
          updatedThisRound.set(true);
        }
      },
    });
  }, []);

  return (
    <motion.span className="inline text-7xl font-medium">
      {displayText}
    </motion.span>
  );
}
