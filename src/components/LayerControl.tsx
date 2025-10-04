import { useState } from "react";
import type { MapLayer } from "../types";

interface LayerControlProps {
  layers: MapLayer[];
  onToggleLayer: (layerId: string) => void;
}

export default function LayerControl({
  layers,
  onToggleLayer,
}: LayerControlProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    vegetation: true,
    environmental: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const vegetationLayers = layers.filter((l) =>
    ["gain", "loss", "mangrove", "forest"].includes(l.type)
  );
  const environmentalLayers = layers.filter((l) =>
    ["water", "carbon"].includes(l.type)
  );

  const getLayerIcon = (type: MapLayer["type"]) => {
    switch (type) {
      case "gain":
        return "🟢";
      case "loss":
        return "🔴";
      case "mangrove":
        return "🌿";
      case "forest":
        return "🌲";
      case "water":
        return "💧";
      case "carbon":
        return "⚠️";
      default:
        return "📍";
    }
  };

  return (
    <div id="toggleLayersPanel">
      <div
        className={`collapsible-section ${
          expandedSections.vegetation ? "expanded" : ""
        }`}
      >
        <h3
          className="collapsible-header"
          onClick={() => toggleSection("vegetation")}
        >
          Vegetation
        </h3>
        <div className="collapsible-content">
          {vegetationLayers.map((layer) => (
            <label key={layer.id}>
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => onToggleLayer(layer.id)}
              />
              <span style={{ marginLeft: "5px" }}>
                {getLayerIcon(layer.type)} {layer.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div
        className={`collapsible-section ${
          expandedSections.environmental ? "expanded" : ""
        }`}
      >
        <h3
          className="collapsible-header"
          onClick={() => toggleSection("environmental")}
        >
          Environmental
        </h3>
        <div className="collapsible-content">
          {environmentalLayers.map((layer) => (
            <label key={layer.id}>
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => onToggleLayer(layer.id)}
              />
              <span style={{ marginLeft: "5px" }}>
                {getLayerIcon(layer.type)} {layer.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
