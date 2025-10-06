import { TEAM_MEMBERS, NASA_SPACEAPPS_LINK } from "../../config/credits";
import type { TeamMember } from "../../config/credits";
import "./Credits.css";

export function Credits() {
  return (
    <div className="credits-section">
      <h2>Credits</h2>
      <p className="credits-intro">
        This project was created for the{" "}
        <a
          href={NASA_SPACEAPPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="nasa-link"
        >
          NASA SpaceApps Challenge 2025
        </a>{" "}
        by the GeoLab team.
      </p>

      <h3>Team</h3>
      <div className="credits-grid">
        {TEAM_MEMBERS.map((member: TeamMember, index: number) => (
          <div key={index} className="credit-card">
            <h4 className="credit-name">{member.name}</h4>
            <p className="credit-expertise">{member.expertise}</p>
            {member.education && (
              <p className="credit-education">{member.education}</p>
            )}
            <div className="credit-links">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="credit-link"
              >
                <span className="material-icons">group</span>
                LinkedIn
              </a>
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credit-link"
                >
                  <span className="material-icons">language</span>
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
