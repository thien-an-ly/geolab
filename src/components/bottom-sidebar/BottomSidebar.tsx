import "./BottomSidebar.css";
import { FeatureInfo } from "./FeatureInfo";
import type { FeatureClickData } from "../../types";

interface BottomSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureClickData | null;
  year: number;
}

export function BottomSidebar({
  isOpen,
  onClose,
  feature,
  year,
}: BottomSidebarProps) {
  return (
    <div className={`bottom-sidebar ${isOpen ? "open" : ""}`}>
      <div className="bottom-sidebar-header">
        <h3>Time Series Analysis</h3>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="bottom-sidebar-content">
        {feature && (
          <FeatureInfo
            feature={feature.properties}
            layerType={feature.layerType}
            year={year}
          />
        )}
        {!feature && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading time series data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
