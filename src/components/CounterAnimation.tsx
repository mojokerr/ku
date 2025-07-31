import React, { useState, useEffect, useRef } from 'react';

interface CounterAnimationProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const CounterAnimation: React.FC<CounterAnimationProps> = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const startValue = 0;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (end - startValue) * easedProgress;
      
      setCount(Number(currentValue.toFixed(decimals)));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [isVisible, end, duration, decimals]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString('ar-EG');
  };

  return (
    <span ref={counterRef} className="font-bold">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CounterAnimation;
