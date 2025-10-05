import type { Map } from "mapbox-gl";
import type { MapLayerType } from "../../types";
import { updateLayerVisibility, applyLayerFilter } from "../mapLayerUtils";

/**
 * Strategy for handling layer visibility
 */
export type VisibilityStrategy = (
  map: Map,
  layerId: string,
  visible: boolean,
  allLayerStates?: ReadonlyMap<MapLayerType, boolean>
) => void;

/**
 * Default visibility strategy - simple show/hide
 */
const defaultVisibilityStrategy: VisibilityStrategy = (
  map,
  layerId,
  visible
) => {
  updateLayerVisibility(map, layerId, visible ? "visible" : "none");
};

/**
 * Shared mangrove-change layer visibility strategy.
 *
 * Coordinates between gain and loss filters that share the same "mangrove-change" source layer.
 * This strategy inspects the visibility state of BOTH "gain" and "loss" layers to determine
 * what features to show, rather than acting on a single layer's visibility.
 *
 * **Why `layerId` and `visible` are unused:**
 * - `layerId`: Could be either "gain" or "loss", but we need to check BOTH states to coordinate.
 *   The actual layer we modify is always "mangrove-change" (the shared source layer).
 * - `visible`: Only tells us about ONE layer's state, but we need BOTH gain and loss states
 *   to make the correct filtering decision. We get these from `allLayerStates` instead.
 *
 * **Coordination logic:**
 * - Both visible → Show all features (no filter)
 * - Only gain visible → Filter to show only "Gain" features
 * - Only loss visible → Filter to show only "Loss" features
 * - Neither visible → Hide the layer entirely
 *
 * This prevents the coupling bug where toggling one filter would hide the other.
 *
 * @param map - The Mapbox map instance
 * @param _layerId - Unused; could be "gain" or "loss" but we check both states
 * @param _visible - Unused; only reflects one layer's state, we need both from allLayerStates
 * @param allLayerStates - Map of ALL layer visibility states for coordination
 *
 * @see applyLayerFilter for details on filter behavior with arrays vs single values
 */
const mangroveChangeVisibilityStrategy: VisibilityStrategy = (
  map,
  _layerId,
  _visible,
  allLayerStates
) => {
  const sourceLayerId = "mangrove-change";
  const gainVisible = allLayerStates?.get("gain") ?? false;
  const lossVisible = allLayerStates?.get("loss") ?? false;

  // If both are visible, show both (filter to exclude "No change")
  if (gainVisible && lossVisible) {
    updateLayerVisibility(map, sourceLayerId, "visible");
    applyLayerFilter(map, sourceLayerId, "change_type", ["Gain", "Loss"]);
  }
  // If only gain is visible
  else if (gainVisible) {
    updateLayerVisibility(map, sourceLayerId, "visible");
    applyLayerFilter(map, sourceLayerId, "change_type", "Gain");
  }
  // If only loss is visible
  else if (lossVisible) {
    updateLayerVisibility(map, sourceLayerId, "visible");
    applyLayerFilter(map, sourceLayerId, "change_type", "Loss");
  }
  // If neither is visible, hide the layer
  else {
    updateLayerVisibility(map, sourceLayerId, "none");
  }
};

/**
 * Layer visibility strategies by layer type
 */
const VISIBILITY_STRATEGIES: Partial<Record<MapLayerType, VisibilityStrategy>> =
  {
    gain: mangroveChangeVisibilityStrategy,
    loss: mangroveChangeVisibilityStrategy,
    // Add more custom strategies here as needed
  };

/**
 * Get visibility strategy for a layer type
 */
export function getVisibilityStrategy(
  layerType: MapLayerType
): VisibilityStrategy {
  return VISIBILITY_STRATEGIES[layerType] || defaultVisibilityStrategy;
}
