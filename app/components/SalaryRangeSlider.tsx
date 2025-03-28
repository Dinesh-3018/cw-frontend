import { useState, useCallback, useEffect } from "react";

interface PriceRangeSliderProps {
  fetchJobs: (params: { salary_range: string }) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ fetchJobs }) => {
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(80000);
  const priceGap = 10000;
  const maxLimit = 100000;

  const formatPrice = (price: number) => `₹${price / 1000}k`;

  const handleSalaryChange = useCallback(
    (values: [number, number]) => {
      const [minSalary, maxSalary] = values;
      fetchJobs({ salary_range: `${minSalary}-${maxSalary}` });
    },
    [fetchJobs]
  );

  useEffect(() => {
    handleSalaryChange([minPrice, maxPrice]);
  }, [minPrice, maxPrice, handleSalaryChange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (maxPrice - value >= priceGap) {
      setMinPrice(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value - minPrice >= priceGap) {
      setMaxPrice(value);
    }
  };

  return (
    <div className="w-52">
      <div className="flex justify-between items-center text-black text-sm font-medium mb-4">
        <span>Salary Per Month</span>
        <span>
          {formatPrice(minPrice)} - {formatPrice(maxPrice)}
        </span>
      </div>

      <div className="relative h-1 bg-gray-300 rounded-full">
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            left: `${(minPrice / maxLimit) * 100}%`,
            right: `${100 - (maxPrice / maxLimit) * 100}%`,
          }}
        ></div>
      </div>

      <div className="relative -top-2">
        <input
          type="range"
          className="absolute w-full top-1 h-1 bg-transparent appearance-none pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black 
            [&::-webkit-slider-thumb]:rounded-full"
          min="0"
          max={maxLimit}
          value={minPrice}
          step="1000"
          onChange={handleMinChange}
        />
        <input
          type="range"
          className="absolute w-full h-1 top-1 bg-transparent appearance-none pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black 
            [&::-webkit-slider-thumb]:rounded-full"
          min="0"
          max={maxLimit}
          value={maxPrice}
          step="1000"
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
