import "./BottomSidebar.css";

interface BottomSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: string | null;
}

export function BottomSidebar({
  isOpen,
  onClose,
  featureId,
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
        {featureId && (
          <div className="feature-info">
            <p>Feature ID: {featureId}</p>
          </div>
        )}
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading time series data...</p>
        </div>
      </div>
    </div>
  );
}
