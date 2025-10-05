import "./Navigation.css";

interface NavigationProps {
  activeTab: "map" | "dashboard";
  onTabChange: (tab: "map" | "dashboard") => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav id="navigationBar">
      <div className="nav-brand">
        <div className="brand-header">
          <img src="/logo.svg" alt="GeoLab Logo" className="brand-logo" />
          <h1>Project GeoLab</h1>
        </div>
        <p>Ecological indicators and carbon degradation analysis</p>
      </div>
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "map" ? "active" : ""}`}
          onClick={() => onTabChange("map")}
        >
          Map View
        </button>
        <button
          className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => onTabChange("dashboard")}
        >
          Dashboard
        </button>
      </div>
    </nav>
  );
}
