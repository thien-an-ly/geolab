import "./Navigation.css";

interface NavigationProps {
  activeTab: "map" | "dashboard";
  onTabChange: (tab: "map" | "dashboard") => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
}: NavigationProps) {
  return (
    <nav id="navigationBar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🌿 Kakadu Wetlands Sentinel</h1>
          <p>Ecological indicators and carbon degradation analysis</p>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "map" ? "active" : ""}`}
            onClick={() => onTabChange("map")}
          >
            🗺️ Map View
          </button>
          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => onTabChange("dashboard")}
          >
            📊 Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}
