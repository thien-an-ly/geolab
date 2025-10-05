import { useState } from "react";
import type { MapLayer } from "../../types";
import { DATA_SOURCES_CONFIG } from "../../config/dataSources";
import "./ControlSidebar.css";
import { getLayerIcon } from "../../utils/layerHelpers";

interface ControlSidebarProps {
  layers: MapLayer[];
  onToggleLayer: (layerId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ControlSidebar({
  layers,
  onToggleLayer,
  isOpen,
  onToggle,
}: ControlSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    vegetation: true,
    environmental: true,
    legend: true,
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
    ["flood", "carbon"].includes(l.type)
  );

  return (
    <>
      {/* Drawer Button */}
      <button
        className={`drawer-button ${isOpen ? "hidden" : ""}`}
        onClick={onToggle}
        aria-label="Open controls"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`control-sidebar ${isOpen ? "open" : ""}`}>
        <div className="control-sidebar-header">
          <h2>Map Controls</h2>
          <button
            className="close-sidebar-button"
            onClick={onToggle}
            aria-label="Close controls"
          >
            ×
          </button>
        </div>

        <div className="control-sidebar-content">
          {/* Layer Controls */}
          <div
            className={`control-section ${
              expandedSections.vegetation ? "expanded" : ""
            }`}
          >
            <h3
              className="control-section-header"
              onClick={() => toggleSection("vegetation")}
            >
              🌿 Vegetation Layers
            </h3>
            <div className="control-section-content">
              {vegetationLayers.map((layer) => (
                <label key={layer.id} className="layer-checkbox">
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => onToggleLayer(layer.id)}
                  />
                  <span>
                    {getLayerIcon(layer.type)} {layer.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            className={`control-section ${
              expandedSections.environmental ? "expanded" : ""
            }`}
          >
            <h3
              className="control-section-header"
              onClick={() => toggleSection("environmental")}
            >
              🌍 Environmental Layers
            </h3>
            <div className="control-section-content">
              {environmentalLayers.map((layer) => (
                <label key={layer.id} className="layer-checkbox">
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => onToggleLayer(layer.id)}
                  />
                  <span>
                    {getLayerIcon(layer.type)} {layer.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div
            className={`control-section ${
              expandedSections.legend ? "expanded" : ""
            }`}
          >
            <h3
              className="control-section-header"
              onClick={() => toggleSection("legend")}
            >
              🎨 Legend
            </h3>
            <div className="control-section-content">
              <div className="legend-items">
                {DATA_SOURCES_CONFIG.map((source) => (
                  <div key={source.id} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: source.style.fillColor }}
                    ></span>
                    <span className="legend-label">{source.name}</span>
                  </div>
                ))}
              </div>
              <div className="legend-about">
                <strong>About</strong>
                <p>
                  Satellite-derived ecological indicators for Kakadu National
                  Park showing mangrove changes and carbon degradation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
}
