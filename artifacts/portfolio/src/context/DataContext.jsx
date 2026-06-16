/**
 * DataContext.jsx
 *
 * Data layer for public pages.
 *
 *  MOCK_MODE = true  (request.js) → data loaded directly from local JSON files
 *  MOCK_MODE = false              → data fetched from real API (PORTFOLIO_ENDPOINTS)
 */
import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_MODE, apiFetch } from "@/api/request";
import { PORTFOLIO_ENDPOINTS as EP } from "@/api/endpoints";

// ── JSON seed data (imported at build time; used when MOCK_MODE = true) ──────
import professorData from "@/api/mockData/professor.json";
import aboutData from "@/api/mockData/about.json";
import educationData from "@/api/mockData/education.json";
import experiencesData from "@/api/mockData/experiences.json";
import coursesData from "@/api/mockData/courses.json";
import researchesData from "@/api/mockData/researches.json";
import achievementsData from "@/api/mockData/achievements.json";
import blogsData from "@/api/mockData/blogs.json";
import messagesData from "@/api/mockData/messages.json";
import settingsData from "@/api/mockData/settings.json";
import positionsData from "@/api/mockData/positions.json";

// ── Generic hooks ────────────────────────────────────────────────────────────

/** Extract the first array value from a response object */
function extractArray(res) {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    for (const v of Object.values(res)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

/** Hook for a list resource (returns array). Falls back to JSON data if API fails. */
function usePublicList(jsonData, apiUrl) {
  const [data, setData] = useState(MOCK_MODE ? jsonData : []);

  useEffect(() => {
    if (MOCK_MODE) return;
    let active = true;
    apiFetch(apiUrl, "GET")
      .then((res) => {
        if (!active) return;
        const arr = extractArray(res);
        setData(arr.length > 0 ? arr : jsonData);
      })
      .catch(() => {
        if (active) setData(jsonData);
      });
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

/** Hook for a single-object resource (returns object or null). Falls back to JSON data if API fails. */
function usePublicObject(jsonData, apiUrl) {
  const [data, setData] = useState(MOCK_MODE ? jsonData : null);

  useEffect(() => {
    if (MOCK_MODE) return;
    let active = true;
    apiFetch(apiUrl, "GET")
      .then((res) => {
        if (!active) return;
        setData(res ?? jsonData ?? null);
      })
      .catch(() => {
        if (active) setData(jsonData ?? null);
      });
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

// ── Contexts ─────────────────────────────────────────────────────────────────
const ProfessorContext = createContext(null);
const AboutContext = createContext(null);
const EducationContext = createContext([]);
const ExperienceContext = createContext([]);
const CoursesContext = createContext([]);
const ResearchesContext = createContext([]);
const AchievementsContext = createContext([]);
const BlogsContext = createContext([]);
const MessagesContext = createContext([]);
const SettingsContext = createContext(null);
const PositionsContext = createContext([]);

// ── Public hooks ─────────────────────────────────────────────────────────────
export const useProfessor = () => useContext(ProfessorContext);
export const useAbout = () => useContext(AboutContext);
export const useEducation = () => useContext(EducationContext);
export const useExperience = () => useContext(ExperienceContext);
export const useCourses = () => useContext(CoursesContext);
export const useResearches = () => useContext(ResearchesContext);
export const useAchievements = () => useContext(AchievementsContext);
export const useBlogs = () => useContext(BlogsContext);
export const useMessages = () => useContext(MessagesContext);
export const useSettings = () => useContext(SettingsContext);
export const usePositions = () => useContext(PositionsContext);

// ── Provider ─────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }) => {
  const professor = usePublicObject(professorData, EP.profile.get);
  const about = usePublicObject(aboutData, EP.about.get);
  const settings = usePublicObject(settingsData, EP.settings.get);
  const education = usePublicList(educationData, EP.education.list);
  const experiences = usePublicList(experiencesData, EP.experiences.list);
  const courses = usePublicList(coursesData, EP.courses.list);
  const researches = usePublicList(researchesData, EP.researches.list);
  const achievements = usePublicList(achievementsData, EP.achievements.list);
  const blogs = usePublicList(blogsData, EP.blogs.list);
  const messages = usePublicList(messagesData, "/messages");
  const positions = usePublicList(positionsData, EP.positions.list);

  return (
    <ProfessorContext.Provider value={professor}>
      <AboutContext.Provider value={about}>
        <EducationContext.Provider value={education}>
          <ExperienceContext.Provider value={experiences}>
            <CoursesContext.Provider value={courses}>
              <ResearchesContext.Provider value={researches}>
                <AchievementsContext.Provider value={achievements}>
                  <BlogsContext.Provider value={blogs}>
                    <SettingsContext.Provider value={settings}>
                      <PositionsContext.Provider value={positions}>
                        <MessagesContext.Provider value={messages}>
                          {children}
                        </MessagesContext.Provider>
                      </PositionsContext.Provider>
                    </SettingsContext.Provider>
                  </BlogsContext.Provider>
                </AchievementsContext.Provider>
              </ResearchesContext.Provider>
            </CoursesContext.Provider>
          </ExperienceContext.Provider>
        </EducationContext.Provider>
      </AboutContext.Provider>
    </ProfessorContext.Provider>
  );
};
