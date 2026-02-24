"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { suShiJourney, JourneyEvent } from "./data/suShiJourney";
import Timeline from "./components/Timeline";
import InfoPopup from "./components/InfoPopup";

// MapView must be rendered client-side only (Mapbox GL requires browser APIs)
const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-void-black">
      <span className="text-time-gold text-opacity-60 text-sm animate-pulse">
        Loading map…
      </span>
    </div>
  ),
});

const { events } = suShiJourney;
const minYear = events.reduce((m, e) => Math.min(m, e.year), Infinity);
const maxYear = events.reduce((m, e) => Math.max(m, e.year), -Infinity);

export default function Home() {
  const [currentYear, setCurrentYear] = useState(minYear);
  const [selectedEvent, setSelectedEvent] = useState<JourneyEvent | null>(null);

  const handleEventSelect = useCallback((event: JourneyEvent) => {
    setSelectedEvent(event);
    setCurrentYear(event.year);
  }, []);

  const handleEventJump = useCallback((event: JourneyEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleClose = useCallback(() => setSelectedEvent(null), []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-void-black">
      {/* Map fills the entire viewport */}
      <MapView
        events={events}
        currentYear={currentYear}
        selectedEvent={selectedEvent}
        onEventSelect={handleEventSelect}
      />

      {/* Top-left brand header */}
      <header className="absolute top-0 left-0 z-10 px-6 py-4 pointer-events-none">
        <div className="flex items-baseline gap-3">
          <h1 className="text-time-gold font-bold text-2xl tracking-widest">
            LONG KNOCK
          </h1>
          <span className="text-stone-500 text-sm">叩寂</span>
        </div>
        <p className="text-stone-500 text-xs mt-0.5 tracking-wider">
          Knocking on the Silent Past
        </p>
      </header>

      {/* Top-right subject badge */}
      <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
        <p className="text-time-gold text-sm font-semibold">
          {suShiJourney.subjectChinese}
        </p>
        <p className="text-stone-500 text-xs">{suShiJourney.period}</p>
        <p className="text-stone-600 text-[10px] mt-0.5 italic">
          {suShiJourney.theme}
        </p>
      </div>

      {/* Info popup */}
      <InfoPopup event={selectedEvent} onClose={handleClose} />

      {/* Bottom timeline panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-4 bg-gradient-to-t from-void-black via-void-black/95 to-transparent">
        <Timeline
          events={events}
          currentYear={currentYear}
          minYear={minYear}
          maxYear={maxYear}
          onYearChange={setCurrentYear}
          onEventJump={handleEventJump}
        />
      </div>

      {/* Subtle bottom-left hint */}
      <p className="absolute bottom-4 right-6 z-20 text-stone-700 text-[10px] pointer-events-none">
        长叩史门，必有回响。
      </p>
    </main>
  );
}
