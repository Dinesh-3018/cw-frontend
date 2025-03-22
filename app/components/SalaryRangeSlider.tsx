/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

interface SalaryRangeSliderProps {
  minValue: number;
  maxValue: number;
  step?: number;
  initialValues?: [number, number];
  onChange?: (values: [number, number]) => void;
}

const SalaryRangeSlider: React.FC<SalaryRangeSliderProps> = ({
  minValue,
  maxValue,
  step = 1000,
  initialValues = [50000, 80000],
  onChange,
}) => {
  const [values, setValues] = useState<[number, number]>(initialValues);
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeThumb = useRef<"min" | "max" | null>(null);

  const getPositionFromValue = (value: number): number =>
    ((value - minValue) / (maxValue - minValue)) * 100;

  const minPosition = useMotionValue(getPositionFromValue(values[0]));
  const maxPosition = useMotionValue(getPositionFromValue(values[1]));

  const getValueFromPosition = (position: number): number => {
    let rawValue = minValue + ((maxValue - minValue) * position) / 100;
    return Math.min(
      Math.max(Math.round(rawValue / step) * step, minValue),
      maxValue
    );
  };

  const handleDrag = (deltaX: number, thumbType: "min" | "max") => {
    if (!sliderRef.current) return;

    const sliderWidth = sliderRef.current.getBoundingClientRect().width;
    let newPosition = (deltaX / sliderWidth) * 100;

    if (thumbType === "min") {
      newPosition = Math.max(
        0,
        Math.min(newPosition + minPosition.get(), maxPosition.get() - 5)
      );
      minPosition.set(newPosition);
    } else {
      newPosition = Math.max(
        minPosition.get() + 5,
        Math.min(100, newPosition + maxPosition.get())
      );
      maxPosition.set(newPosition);
    }

    const newValue = getValueFromPosition(
      thumbType === "min" ? minPosition.get() : maxPosition.get()
    );
    setValues(
      thumbType === "min" ? [newValue, values[1]] : [values[0], newValue]
    );

    onChange?.(
      thumbType === "min" ? [newValue, values[1]] : [values[0], newValue]
    );
  };

  useEffect(() => {
    minPosition.set(getPositionFromValue(values[0]));
    maxPosition.set(getPositionFromValue(values[1]));
  }, [values, minValue, maxValue]);

  return (
    <div>
      <div className="flex justify-between mb-2 w-72 items-center">
        <span className="text-[16px] font-[SatoshiMedium] text-[#222]">
          Salary Per Month
        </span>
        <span className="text-md font-[SatoshiMedium] text-[#222]">
          ₹{values[0] / 1000}k - ₹{values[1] / 1000}k
        </span>
      </div>

      <div
        ref={sliderRef}
        className="relative h-0.5 w-full bg-gray-300 rounded-md mt-4"
      >
        <motion.div
          className="absolute h-full bg-[#222222] ml-1 mr-1.5 rounded-md"
          style={{
            left: `${minPosition.get()}%`,
            right: `${100 - maxPosition.get()}%`,
          }}
        />

        {(["min", "max"] as const).map((thumbType) => (
          <motion.div
            key={thumbType}
            className="absolute w-4 h-4 border-[3px] border-[#000000] rounded-full -top-[7px] cursor-pointer"
            style={{
              left: `calc(${
                thumbType === "min" ? minPosition.get() : maxPosition.get()
              }% - 12px)`,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(_, info) => handleDrag(info.delta.x, thumbType)}
          />
        ))}
      </div>
    </div>
  );
};

export default SalaryRangeSlider;
