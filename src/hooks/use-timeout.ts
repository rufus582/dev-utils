import { useEffect, useEffectEvent, useState } from "react";

interface UseTimeoutProps {
  initialTimeout?: number;
  onEachSecond?: (remainingSeconds: number) => void;
  onTimeout?: () => void;
}

export const useTimeout = ({
  initialTimeout,
  onEachSecond,
  onTimeout,
}: UseTimeoutProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialTimeout);
  const [timeoutDate, setTimeoutDate] = useState<Date>(() => {
    const today = new Date();
    today.setSeconds(today.getSeconds() + (initialTimeout ?? 0));
    return today;
  });

  const startTimer = (timeout?: number) => {
    const today = new Date();
    today.setSeconds(today.getSeconds() + (timeout ?? initialTimeout ?? 0));
    setTimeoutDate(today);
    setRemainingSeconds(timeout ?? initialTimeout);
  };

  const handleTimer = useEffectEvent(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const remainingTime = timeoutDate.getTime() - now.getTime();
      const _remainingSeconds = Math.round(remainingTime / 1000);
      if (_remainingSeconds < 0) {
        clearInterval(intervalId);
        setRemainingSeconds(0);
        onTimeout?.();
      } else {
        onEachSecond?.(_remainingSeconds);
        setRemainingSeconds(_remainingSeconds);
      }
    }, 1000);
    return intervalId;
  });

  useEffect(() => {
    let intervalId = undefined;
    if (remainingSeconds !== undefined) intervalId = handleTimer();

    return () => clearInterval(intervalId);
  }, [remainingSeconds]);

  return { remainingSeconds, startTimer };
};
