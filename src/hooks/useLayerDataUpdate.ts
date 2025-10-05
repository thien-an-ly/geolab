import { useEffect, useRef, useState } from "react";
import type { Map } from "mapbox-gl";
import { DATA_SOURCES_CONFIG } from "../config/dataSources";
import { updateDataSourcesForYear } from "../utils/dataSourceUtils";
import {
  fetchGeoJSONData,
  addMapSource,
  addMapLayers,
  removeMapLayers,
  updateSourceData,
} from "../utils/mapLayerUtils";

interface UseLayerDataUpdateOptions {
  map: Map; // Non-null: guaranteed by initialized flag
  initialized: boolean;
  currentYear: number;
}

/**
 * Custom hook to update layer data when year changes.
 *
 * Note: map is non-null because initialized can only be true if map is valid
 * (enforced by useMapLayers which only sets initialized after using map).
 */
export function useDataSourceUpdate({
  map,
  initialized,
  currentYear,
}: UseLayerDataUpdateOptions) {
  const previousYear = useRef<number | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // initialized can only be true if map is valid
    // (guaranteed by useMapLayers' initialization logic)
    if (!initialized) return;

    // Check if year actually changed (null means first run)
    if (previousYear.current !== null && previousYear.current === currentYear)
      return;

    const updatedDataSources = updateDataSourcesForYear(
      DATA_SOURCES_CONFIG,
      currentYear
    );

    // console.log(`Updating map data for year ${currentYear}...`);

    // Set loading flag to false when starting data update
    setDataLoaded(false);

    const updateDataSources = async () => {
      for (const config of updatedDataSources) {
        const sourceId = `${config.id}-source`;
        const fillLayerId = `${config.id}-fill`;
        const lineLayerId = `${config.id}-line`;

        try {
          // Fetch new data for the year
          const data = await fetchGeoJSONData(config.dataUrl);

          if (!data) {
            // console.warn(
            //   `No data available for ${config.name} in year ${currentYear} - removing layers`
            // );
            // Remove layers if data is not available
            removeMapLayers(map, config.id);
            continue;
          }

          // If source exists, update it
          const updated = updateSourceData(map, sourceId, data);

          if (updated) {
            // console.log(`✓ Updated ${config.name} for year ${currentYear}`);
          } else {
            // If source doesn't exist, create it (initial load or re-add after removal)
            addMapSource(map, sourceId, data);

            // For shared data sources (e.g., mangrove-change serves both gain and loss),
            // check if any related layer types are visible
            // Default to hidden; visibility will be managed by useLayerVisibility
            const visibility = "none";

            // Add layers
            if (!map.getLayer(fillLayerId) && !map.getLayer(lineLayerId)) {
              addMapLayers(map, config, sourceId, visibility);
            }

            // console.log(`✓ Loaded ${config.name} for year ${currentYear}`);
          }
          /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        } catch (error) {
          // console.warn(
          //   `Failed to update ${config.name} for year ${currentYear}:`,
          //   error
          // );

          // Remove layers on error as well
          removeMapLayers(map, config.id);
        }
      }

      // Set loading flag to true when all data updates are complete
      // console.log(
      //   `✓ All data loaded for year ${currentYear}, setting dataLoaded=true`
      // );
      setDataLoaded(true);
    };

    updateDataSources();
    previousYear.current = currentYear;
    // map and layers are intentionally excluded:
    // - map: stable ref, guaranteed non-null when initialized is true
    // - layers: visibility changes are handled by useLayerVisibility
    // - initialized: triggers on first load, currentYear triggers on year changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, currentYear]);

  return { dataLoaded };
}
