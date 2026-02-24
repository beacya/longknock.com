# Long Knock · 叩寂

> **Knocking on the Silent Past.**  
> 长叩史门，必有回响。

An immersive historical map charting the exile of **Su Shi (苏东坡)** across Song Dynasty China (1056–1101 CE). Built with Next.js, Mapbox GL JS and Tailwind CSS.

## Features

- 🗺 **Dark historical map** — Mapbox GL dark-v11 styled with Void Black + Time Gold brand palette
- ⏳ **Animated timeline slider** — drag the slider to watch Su Shi's route grow across the map
- 💡 **Breathing effect** — the current map marker pulses to indicate the active time period
- 🔎 **Key event jump** — click named nodes (眉山, 开封, 杭州, 黄州, 儋州…) to fly directly to each location
- 📖 **Ancient/modern popup** — each location shows the historical name, event description, literary works, time confidence, and the modern place name
- 🌫 **Fuzzy/disputed locations** — uncertain sites like 赤壁 are marked with a glowing halo and "存疑" badge

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Map Engine | Mapbox GL JS 3 |
| Styling | Tailwind CSS 4 |
| Data | Hand-curated `suShiJourney.ts` data file |

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your [Mapbox access token](https://mapbox.com):
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the map.

## Data

All journey data lives in [`app/data/suShiJourney.ts`](app/data/suShiJourney.ts).  
Each event has:
- `year` / `yearEnd` — integer years (negative = BCE)
- `displayDate` — human-readable Chinese date string
- `confidence` — float 0.1–1.0 indicating historical certainty
- `location.precision` — `exact` | `fuzzy` | `disputed`
- `location.ancientName` + `modernName` — bilingual place names

## Roadmap

- **v1.5** — UGC correction submissions (Wiki mode)
- **v2.0** — Alexander's Campaign route; cross-continental map
- **v3.0** — Long Knock Travel: heritage travel navigation & hotel integration

