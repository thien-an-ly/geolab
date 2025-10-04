import type { MapLayer } from "../types";

interface LayerControlProps {
  layers: MapLayer[];
  onToggleLayer: (layerId: string) => void;
}

export default function LayerControl({
  layers,
  onToggleLayer,
}: LayerControlProps) {
  const getLayerIcon = (type: MapLayer["type"]) => {
    switch (type) {
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
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "white",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        minWidth: "200px",
        zIndex: 1,
      }}
    >
      <h3
        style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "bold" }}
      >
        Layers
      </h3>
      {layers.map((layer) => (
        <div
          key={layer.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.75rem",
            cursor: "pointer",
          }}
          onClick={() => onToggleLayer(layer.id)}
        >
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={() => onToggleLayer(layer.id)}
            style={{ marginRight: "0.5rem", cursor: "pointer" }}
          />
          <span style={{ marginRight: "0.5rem" }}>
            {getLayerIcon(layer.type)}
          </span>
          <span style={{ fontSize: "0.9rem" }}>{layer.name}</span>
        </div>
      ))}
    </div>
  );
}
