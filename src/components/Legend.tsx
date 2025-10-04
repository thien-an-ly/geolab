import { DATA_SOURCES } from "../config/dataSources";

export default function Legend() {
  return (
    <div id="leftPanel">
      <div className="legend-section">
        <strong>Vegetation Layers</strong>
        {DATA_SOURCES.map((source) => (
          <label key={source.id}>
            <span
              className="legend-color"
              style={{ backgroundColor: source.style.fillColor }}
            ></span>
            {source.name}
          </label>
        ))}
      </div>
      <div className="legend-section">
        <strong>About</strong>
        <p style={{ margin: "5px 0", fontSize: "12px", lineHeight: 1.4 }}>
          Satellite-derived ecological indicators for Kakadu National Park
          showing mangrove changes and carbon degradation.
        </p>
      </div>
    </div>
  );
}
