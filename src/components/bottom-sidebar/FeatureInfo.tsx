import "./FeatureInfo.css";
import {
  formatKey,
  formatValue,
  isKeyExcluded,
} from "../../utils/formatHelpers";
import type { MapLayerType } from "../../types";

interface FeatureInfoProps {
  feature: Record<string, unknown>;
  layerType?: MapLayerType;
  year: number;
}

export function FeatureInfo({ feature, layerType, year }: FeatureInfoProps) {
  // Pretty print all properties for flood or mangrove gain/loss features
  const isGainOrLoss = layerType === "mangrove-change";
  const yearLabel = isGainOrLoss ? "Period" : "Year";
  const yearValue = isGainOrLoss ? `${year - 1} - ${year}` : year.toString();

  // Extract change_type for gain/loss features
  const changeType = feature.change_type as string | undefined;
  const isGain = changeType === "Gain";
  const isLoss = changeType === "Loss";
  const changeLabel = isGain ? "Mangrove gain" : "Mangrove loss";

  // Determine badge class based on layer type
  const getBadgeClass = () => {
    if (isGainOrLoss) {
      if (isGain) return "feature-type-badge feature-type-badge-gain";
      if (isLoss) return "feature-type-badge feature-type-badge-loss";
    }

    // Add layer-specific classes for other types
    switch (layerType) {
      case "mangrove":
        return "feature-type-badge feature-type-badge-mangrove";
      case "flood":
        return "feature-type-badge feature-type-badge-flood";
      case "carbon":
        return "feature-type-badge feature-type-badge-carbon";
      default:
        return "feature-type-badge";
    }
  };

  const badgeLabel = isGainOrLoss ? changeLabel : formatKey(layerType || "");

  return (
    <>
      {layerType && <div className={getBadgeClass()}>{badgeLabel}</div>}
      <div className="property-row">
        <span className="property-key">{yearLabel}:</span>
        <span className="property-value">{yearValue}</span>
      </div>
      {Object.entries(feature).map(([key, value]) => {
        if (isKeyExcluded(key)) return null;
        return (
          <div key={key} className="property-row">
            <span className="property-key">{formatKey(key)}:</span>
            <span className="property-value">{formatValue(value)}</span>
          </div>
        );
      })}
    </>
  );
}
