// Barrel that re-exports all mock data from JSON files.
// Drop-in replacement for the old TS module.
import professor from "./mockData/professor.json";
import education from "./mockData/education.json";
import stats from "./mockData/stats.json";
import achievements from "./mockData/achievements.json";
import researches from "./mockData/researches.json";
import experiences from "./mockData/experiences.json";
import positions from "./mockData/positions.json";
import courses from "./mockData/courses.json";
import blogs from "./mockData/blogs.json";
import messages from "./mockData/messages.json";
import media from "./mockData/media.json";
import dashboardCharts from "./mockData/dashboardCharts.json";
import settings from "./mockData/settings.json";

export {
  professor,
  education,
  stats,
  achievements,
  researches,
  experiences,
  positions,
  courses,
  blogs,
  messages,
  media,
  dashboardCharts,
  settings,
};
