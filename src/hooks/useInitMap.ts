import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import { useMap } from "react-map-gl";

export interface UseInitMapResult {
  map: Map;
  initialized: boolean;
}

/**
 * Custom hook to get map instance and signal when it's ready for layer operations.
 * Does not load data - that's handled by useLayerDataUpdate.
 */
export function useInitMap(): UseInitMapResult {
  const { current } = useMap();
  const mapRef = current?.getMap() || null;

  const [initialized, setInitialized] = useState(false);
  const [map, setMap] = useState<Map>(mapRef!);

  useEffect(() => {
    if (!mapRef || initialized) return;

    // Map is ready - signal that layer operations can begin
    setInitialized(true);
    setMap(mapRef);
    // console.log("✓ Map ready for layer operations");
  }, [mapRef, initialized]);

  return { map, initialized };
}
