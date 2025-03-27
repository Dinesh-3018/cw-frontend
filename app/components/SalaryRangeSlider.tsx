import React, { useState, useRef } from "react";
import { motion, PanInfo } from "framer-motion";

interface SalaryRangeSliderProps {
  minValue: number;
  maxValue: number;
  step?: number;
  initialValues?: [number, number];
  onChange?: (values: [number, number]) => void;
}

const SalaryRangeSlider: React.FC<SalaryRangeSliderProps> = ({
  minValue = 30000,
  maxValue = 200000,
  step = 1000,
  initialValues = [50000, 155000],
  onChange,
}) => {
  const [values, setValues] = useState<[number, number]>(initialValues);
  const sliderRef = useRef<HTMLDivElement>(null);

  const calculatePercentage = (value: number) =>
    ((value - minValue) / (maxValue - minValue)) * 100;

  const calculateValue = (percentage: number) => {
    const value = minValue + (maxValue - minValue) * (percentage / 100);
    return Math.round(value / step) * step;
  };

  const handleMinThumbDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!sliderRef.current) return;

    const sliderWidth = sliderRef.current.getBoundingClientRect().width;
    const currentPercentage = calculatePercentage(values[0]);
    const deltaPercentage = (info.delta.x / sliderWidth) * 100;

    const newPercentage = Math.max(
      0,
      Math.min(
        currentPercentage + deltaPercentage,
        calculatePercentage(values[1]) - 2
      )
    );

    const newValue = calculateValue(newPercentage);
    const newValues: [number, number] = [newValue, values[1]];

    setValues(newValues);
    onChange?.(newValues);
  };

  const handleMaxThumbDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!sliderRef.current) return;

    const sliderWidth = sliderRef.current.getBoundingClientRect().width;
    const currentPercentage = calculatePercentage(values[1]);
    const deltaPercentage = (info.delta.x / sliderWidth) * 100;

    const newPercentage = Math.max(
      calculatePercentage(values[0]) + 2,
      Math.min(currentPercentage + deltaPercentage, 100)
    );

    const newValue = calculateValue(newPercentage);
    const newValues: [number, number] = [values[0], newValue];

    setValues(newValues);
    onChange?.(newValues);
  };

  const minThumbPosition = calculatePercentage(values[0]);
  const maxThumbPosition = calculatePercentage(values[1]);

  return (
    <div className="w-full px-4 py-6">
      <div className="relative w-full">
        {/* Background Track */}
        <div
          ref={sliderRef}
          className="w-full h-2 bg-gray-200 rounded-full absolute top-1/2 transform -translate-y-1/2"
        >
          {/* Filled Track */}
          <div
            className="absolute h-full bg-blue-500 rounded-full"
            style={{
              left: `${minThumbPosition}%`,
              right: `${100 - maxThumbPosition}%`,
            }}
          />
        </div>

        {/* Min Thumb */}
        <motion.div
          drag="x"
          dragConstraints={sliderRef}
          dragElastic={0}
          onDrag={handleMinThumbDrag}
          style={{
            left: `${minThumbPosition}%`,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute top-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        />

        {/* Max Thumb */}
        <motion.div
          drag="x"
          dragConstraints={sliderRef}
          dragElastic={0}
          onDrag={handleMaxThumbDrag}
          style={{
            left: `${maxThumbPosition}%`,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute top-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        />
      </div>

      {/* Value Display */}
      <div className="flex justify-between mt-6 text-sm text-gray-600">
        <span>₹{Math.round(values[0] / 1000)}k</span>
        <span className="font-semibold">Salary Range</span>
        <span>₹{Math.round(values[1] / 1000)}k</span>
      </div>
    </div>
  );
};

export default SalaryRangeSlider;
