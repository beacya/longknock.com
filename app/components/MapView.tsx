"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { JourneyEvent } from "../data/suShiJourney";

interface MapViewProps {
  events: JourneyEvent[];
  currentYear: number;
  selectedEvent: JourneyEvent | null;
  onEventSelect: (event: JourneyEvent) => void;
}

const TIME_GOLD = "#C9A84C";
const FUZZY_GOLD = "#C9A84C66";

export default function MapView({
  events,
  currentYear,
  selectedEvent,
  onEventSelect,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Build GeoJSON for the path up to currentYear
  const buildPathGeoJSON = useCallback(
    (upToYear: number) => {
      const visibleEvents = events
        .filter((e) => e.year <= upToYear)
        .sort((a, b) => a.year - b.year);

      const coordinates = visibleEvents.map((e) => e.location.coordinates);

      return {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "LineString" as const,
              coordinates,
            },
          },
        ],
      };
    },
    [events]
  );

  // Build GeoJSON points up to currentYear
  const buildPointsGeoJSON = useCallback(
    (upToYear: number) => {
      const visibleEvents = events
        .filter((e) => e.year <= upToYear)
        .sort((a, b) => a.year - b.year);

      return {
        type: "FeatureCollection" as const,
        features: visibleEvents.map((e) => ({
          type: "Feature" as const,
          properties: {
            id: e.id,
            title: e.title,
            ancientName: e.location.ancientName,
            year: e.year,
            confidence: e.confidence,
            precision: e.location.precision,
            isKeyNode: e.isKeyNode ?? false,
            isCurrent: e.year === currentYear,
          },
          geometry: {
            type: "Point" as const,
            coordinates: e.location.coordinates,
          },
        })),
      };
    },
    [events, currentYear]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token === "your_mapbox_token_here") {
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [114.308, 30.5],
      zoom: 4.5,
      minZoom: 2,
      maxZoom: 14,
      projection: "mercator",
    });

    mapRef.current = map;

    map.on("load", () => {
      // Add path source
      map.addSource("journey-path", {
        type: "geojson",
        data: buildPathGeoJSON(events[0]?.year ?? 1056),
      });

      // Add path line layer
      map.addLayer({
        id: "journey-path-line",
        type: "line",
        source: "journey-path",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": TIME_GOLD,
          "line-width": 1.5,
          "line-opacity": 0.6,
          "line-dasharray": [4, 2],
        },
      });

      // Add points source
      map.addSource("journey-points", {
        type: "geojson",
        data: buildPointsGeoJSON(events[0]?.year ?? 1056),
      });

      // Glow layer (fuzzy/disputed)
      map.addLayer({
        id: "journey-points-glow",
        type: "circle",
        source: "journey-points",
        filter: ["==", ["get", "precision"], "disputed"],
        paint: {
          "circle-radius": 18,
          "circle-color": FUZZY_GOLD,
          "circle-opacity": 0.3,
          "circle-blur": 1,
        },
      });

      // Normal points layer
      map.addLayer({
        id: "journey-points-circle",
        type: "circle",
        source: "journey-points",
        paint: {
          "circle-radius": [
            "case",
            ["get", "isKeyNode"],
            8,
            5,
          ],
          "circle-color": [
            "case",
            ["==", ["get", "precision"], "disputed"],
            FUZZY_GOLD,
            TIME_GOLD,
          ],
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["get", "confidence"],
            0.1, 0.3,
            1.0, 1.0,
          ],
          "circle-stroke-width": [
            "case",
            ["get", "isCurrent"],
            2,
            1,
          ],
          "circle-stroke-color": "#fff",
        },
      });

      // Label layer
      map.addLayer({
        id: "journey-points-label",
        type: "symbol",
        source: "journey-points",
        layout: {
          "text-field": ["get", "ancientName"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": TIME_GOLD,
          "text-halo-color": "#0a0a0a",
          "text-halo-width": 1.5,
        },
      });

      // Click handler
      map.on("click", "journey-points-circle", (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const eventId = feature.properties?.id as string;
        const found = events.find((ev) => ev.id === eventId);
        if (found) onEventSelect(found);
      });

      map.on("mouseenter", "journey-points-circle", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "journey-points-circle", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapRef.current = null;
    };
    // This effect intentionally runs once on mount to initialize the Mapbox map instance.
    // buildPathGeoJSON and buildPointsGeoJSON are updated via separate effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map data when currentYear changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const pathSource = map.getSource("journey-path") as
      | mapboxgl.GeoJSONSource
      | undefined;
    const pointsSource = map.getSource("journey-points") as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (pathSource) pathSource.setData(buildPathGeoJSON(currentYear));
    if (pointsSource) pointsSource.setData(buildPointsGeoJSON(currentYear));
  }, [currentYear, buildPathGeoJSON, buildPointsGeoJSON]);

  // FlyTo when selected event changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEvent) return;
    map.flyTo({
      center: selectedEvent.location.coordinates,
      zoom: 7,
      speed: 0.8,
      curve: 1.2,
    });
  }, [selectedEvent]);

  // Breathing animation for current-year marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    let frame: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * Math.PI * 1.2);

      if (map.getLayer("journey-points-circle")) {
        map.setPaintProperty("journey-points-circle", "circle-stroke-width", [
          "case",
          ["==", ["get", "year"], currentYear],
          2 + 2 * pulse,
          1,
        ]);
      }

      // Breathing glow for current point
      if (map.getLayer("journey-points-glow")) {
        map.setPaintProperty(
          "journey-points-glow",
          "circle-radius",
          12 + 8 * pulse
        );
        map.setPaintProperty(
          "journey-points-glow",
          "circle-opacity",
          0.15 + 0.2 * pulse
        );
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    animFrameRef.current = frame;

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [currentYear]);

  // Clear old markers
  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, [events]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasToken = token && token !== "your_mapbox_token_here";

  if (!hasToken) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-void-black text-center gap-4 px-8">
        <div className="text-time-gold text-5xl mb-2">叩</div>
        <p className="text-time-gold font-semibold text-lg">
          Mapbox Access Token Required
        </p>
        <p className="text-stone-400 text-sm max-w-md">
          Create a <code className="text-time-gold">.env.local</code> file and
          set your Mapbox token:
        </p>
        <code className="bg-stone-900 text-time-gold text-xs px-4 py-2 rounded-md">
          NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
        </code>
        <p className="text-stone-500 text-xs mt-2">
          Get a free token at{" "}
          <span className="text-time-gold underline">mapbox.com</span>
        </p>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
