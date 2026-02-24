"use client";

import { useCallback, useEffect, useRef } from "react";
import { JourneyEvent } from "../data/suShiJourney";

interface TimelineProps {
  events: JourneyEvent[];
  currentYear: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
  onEventJump: (event: JourneyEvent) => void;
}

export default function Timeline({
  events,
  currentYear,
  minYear,
  maxYear,
  onYearChange,
  onEventJump,
}: TimelineProps) {
  const sliderRef = useRef<HTMLInputElement>(null);

  const yearToPercent = useCallback(
    (year: number) => ((year - minYear) / (maxYear - minYear)) * 100,
    [minYear, maxYear]
  );

  // Update CSS --fill variable for slider track gradient
  useEffect(() => {
    if (sliderRef.current) {
      const fillPercent = yearToPercent(currentYear);
      sliderRef.current.style.setProperty("--fill", `${fillPercent}%`);
    }
  }, [currentYear, yearToPercent]);

  const keyEvents = events.filter((e) => e.isKeyNode);

  const visibleEvents = events.filter((e) => e.year <= currentYear);
  const activeEvent = visibleEvents[visibleEvents.length - 1];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Current year display */}
      <div className="flex items-baseline gap-3">
        <span className="text-time-gold font-bold text-2xl tabular-nums">
          {currentYear > 0 ? `${currentYear} CE` : `${Math.abs(currentYear)} BCE`}
        </span>
        {activeEvent && (
          <span className="text-stone-400 text-sm truncate">
            {activeEvent.location.ancientName} · {activeEvent.title}
          </span>
        )}
      </div>

      {/* Slider + key event ticks */}
      <div className="relative flex flex-col gap-1">
        {/* Key event tick marks */}
        <div className="relative h-5">
          {keyEvents.map((e) => (
            <button
              key={e.id}
              title={`${e.location.ancientName} (${e.year})`}
              onClick={() => {
                onYearChange(e.year);
                onEventJump(e);
              }}
              style={{ left: `${yearToPercent(e.year)}%` }}
              className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group"
            >
              <div className="w-px h-3 bg-time-gold opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] text-time-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mt-0.5">
                {e.location.ancientName}
              </span>
            </button>
          ))}
        </div>

        {/* Slider */}
        <input
          ref={sliderRef}
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(ev) => onYearChange(Number(ev.target.value))}
          className="timeline-slider w-full"
        />

        {/* Year labels */}
        <div className="flex justify-between text-[10px] text-stone-600 mt-1">
          <span>{minYear} CE</span>
          <span>{maxYear} CE</span>
        </div>
      </div>

      {/* Key node buttons */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {keyEvents.map((e) => (
          <button
            key={e.id}
            onClick={() => {
              onYearChange(e.year);
              onEventJump(e);
            }}
            className={`px-2.5 py-1 rounded text-[11px] border transition-all cursor-pointer ${
              currentYear >= e.year
                ? "border-time-gold text-time-gold bg-time-gold/10 hover:bg-time-gold/20"
                : "border-stone-700 text-stone-600 hover:border-stone-500 hover:text-stone-400"
            }`}
          >
            {e.location.ancientName}
          </button>
        ))}
      </div>
    </div>
  );
}
