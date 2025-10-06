/**
 * Team credits configuration
 */

export interface TeamMember {
  name: string;
  expertise: string;
  education?: string;
  linkedin: string;
  website?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Mirabdulla Mirsodikov",
    expertise:
      "Geospatial Analysis, Remote Sensing, Spatial Data Processing, and GIS",
    education: "MSc in Geospatial Science, RMIT University",
    linkedin: "https://www.linkedin.com/in/mirabdulla-mirsodikov-89a1a5272/",
  },
  {
    name: "Josh Anderson",
    expertise:
      "Spatial Analyst, Expertise in GIS/Remote Sensing and Agricultural Science",
    education: "MSc in Geospatial Science, RMIT University",
    linkedin: "https://www.linkedin.com/in/joshpanderson/",
  },
  {
    name: "Thien An Ly",
    expertise:
      "Software Engineer, Full Stack Developer, System Design/Solution Architect (Associate)",
    education: "BSc in Computer Science, Swinburne University of Technology",
    linkedin: "https://www.linkedin.com/in/thien-an-ly/",
    website: "https://thien-an-ly.github.io/",
  },
  {
    name: "Thomas Grassia",
    expertise: "GIS undergraduate",
    education: "BSc in Geospatial Science, Arizona State University",
    linkedin: "https://www.linkedin.com/in/thomas-grassia-4b70b6156/",
    website: "https://www.thomasg.dance/",
  },
];

export const NASA_SPACEAPPS_LINK =
  "https://www.spaceappschallenge.org/2025/find-a-team/geolab-vision/?tab=project";
