import type { MapLayer } from "../../types";
import { getLegendColor } from "../../utils/layerHelpers";
import "./Legend.css";

interface LegendProps {
  layers: MapLayer[];
}

export function Legend({ layers }: LegendProps) {
  // Filter to only show visible layers
  const visibleLayers = layers.filter((layer) => layer.visible);

  if (visibleLayers.length === 0) {
    return null;
  }

  return (
    <div className="legend-container">
      <div className="legend-header">Active Layers</div>
      <div className="legend-items">
        {visibleLayers.map((layer) => (
          <div key={layer.id} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: getLegendColor(layer.type) }}
            ></span>
            <span className="legend-label">{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
