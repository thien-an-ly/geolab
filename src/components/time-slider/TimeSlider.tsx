import { useState, useEffect } from "react";
import "./TimeSlider.css";

interface TimeSliderProps {
  isOpen: boolean;
  onToggle: () => void;
  minYear?: number;
  maxYear?: number;
  initialYear?: number;
  onYearChange?: (year: number) => void;
}

export function TimeSlider({
  isOpen,
  onToggle,
  minYear = 2014,
  maxYear = 2024,
  initialYear = 2024,
  onYearChange,
}: TimeSliderProps) {
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Handle window resize for responsive labels
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate year labels based on screen size
  const getYearLabels = () => {
    const years: number[] = [];

    // Always include first and last year
    years.push(minYear);

    if (windowWidth < 480) {
      // Mobile: show only start, middle, end
      const middle = Math.floor((minYear + maxYear) / 2);
      if (middle !== minYear && middle !== maxYear) {
        years.push(middle);
      }
    } else if (windowWidth < 768) {
      // Tablet: show every 2-3 years
      for (let year = minYear + 2; year < maxYear; year += 2) {
        years.push(year);
      }
    } else if (windowWidth < 1024) {
      // Small desktop: show every 2 years
      for (let year = minYear + 2; year < maxYear; year += 2) {
        years.push(year);
      }
    } else {
      // Large desktop: show all years
      for (let year = minYear + 1; year < maxYear; year++) {
        years.push(year);
      }
    }

    years.push(maxYear);
    return Array.from(new Set(years)).sort((a, b) => a - b);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    onYearChange?.(year);
  };

  // Calculate position percentage for a given year
  // Accounts for the slider thumb width (20px) so labels align with thumb center
  const getYearPosition = (year: number) => {
    const totalYears = maxYear - minYear;
    const yearOffset = year - minYear;
    const percentage = yearOffset / totalYears;

    // The thumb is 20px wide, so it can't center at absolute 0% or 100%
    // We need to map the position within the usable track range
    // At 0%, thumb center is at ~10px from left
    // At 100%, thumb center is at ~10px from right
    // This creates a usable range that's slightly inset
    const usableRangeStart = 0.5; // Approximate percentage for thumb radius
    const usableRangeEnd = 99.5; // Approximate percentage for thumb radius
    const usableRange = usableRangeEnd - usableRangeStart;

    return usableRangeStart + percentage * usableRange;
  };

  const yearLabels = getYearLabels();

  return (
    <>
      {/* Clock/Close Button */}
      <button
        className="time-slider-toggle-button"
        onClick={onToggle}
        aria-label={isOpen ? "Close time slider" : "Open time slider"}
      >
        {isOpen ? (
          // X icon when open
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Clock icon when closed
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        )}
      </button>

      {/* Time Slider Panel */}
      <div className={`time-slider-panel ${isOpen ? "open" : ""}`}>
        <div className="time-slider-content">
          <div className="time-slider-header">
            <h3>Time Range</h3>
            <span className="current-year">{currentYear}</span>
          </div>

          <div className="time-slider-controls">
            {/* Slider */}
            <div className="slider-track">
              <input
                type="range"
                min={minYear}
                max={maxYear}
                value={currentYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="year-slider"
                step="1"
              />
            </div>

            {/* Year labels with stop indicators */}
            <div className="year-labels">
              {yearLabels.map((year) => (
                <div
                  key={year}
                  className="year-label-container"
                  style={{ left: `${getYearPosition(year)}%` }}
                >
                  <div className="slider-stop"></div>
                  <span className="year-label">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
