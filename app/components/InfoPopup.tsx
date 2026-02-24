"use client";

import { JourneyEvent } from "../data/suShiJourney";

interface InfoPopupProps {
  event: JourneyEvent | null;
  onClose: () => void;
}

const precisionLabel: Record<string, string> = {
  exact: "确切地点",
  fuzzy: "模糊区域",
  disputed: "存疑地点",
};

const precisionColor: Record<string, string> = {
  exact: "text-emerald-400",
  fuzzy: "text-amber-400",
  disputed: "text-rose-400",
};

export default function InfoPopup({ event, onClose }: InfoPopupProps) {
  if (!event) return null;

  const [lon, lat] = event.location.coordinates;

  return (
    <div className="absolute bottom-36 right-4 z-20 w-80 bg-void-black border border-time-gold/30 rounded-lg shadow-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-time-gold font-bold text-base">
              {event.location.ancientName}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border border-current ${
                precisionColor[event.location.precision]
              }`}
            >
              {precisionLabel[event.location.precision]}
            </span>
          </div>
          <p className="text-stone-400 text-xs mt-0.5">{event.displayDate}</p>
        </div>
        <button
          onClick={onClose}
          className="text-stone-600 hover:text-stone-300 transition-colors text-lg leading-none mt-0.5 cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Event title */}
        <div>
          <h3 className="text-white font-semibold text-sm">{event.title}</h3>
          <p className="text-stone-400 text-xs leading-relaxed mt-1">
            {event.description}
          </p>
        </div>

        {/* Literary work */}
        {event.literaryWork && (
          <div className="flex items-center gap-1.5">
            <span className="text-time-gold text-xs">📜</span>
            <span className="text-time-gold text-xs italic">
              {event.literaryWork}
            </span>
          </div>
        )}

        {/* Confidence */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 text-xs">时间置信度</span>
          <div className="flex-1 h-1 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-time-gold rounded-full"
              style={{ width: `${event.confidence * 100}%` }}
            />
          </div>
          <span className="text-stone-500 text-xs">
            {Math.round(event.confidence * 100)}%
          </span>
        </div>

        {/* Modern hook */}
        <div className="bg-stone-900/60 rounded-md px-3 py-2 border border-stone-800">
          <p className="text-stone-300 text-xs leading-relaxed">
            <span className="text-time-gold font-medium">此处现为</span>{" "}
            {event.location.modernName}
          </p>
          <p className="text-stone-500 text-[10px] mt-1">
            坐标 {lon.toFixed(3)}°E, {lat.toFixed(3)}°N
          </p>
        </div>
      </div>
    </div>
  );
}
