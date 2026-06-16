/**
 * AdminDataContext.jsx
 *
 * Data layer for the admin dashboard.
 *
 *  MOCK_MODE = true  (request.js)  →  data loaded directly from local JSON files
 *  MOCK_MODE = false               →  data fetched from real API (DASHBOARD_ENDPOINTS)
 *
 * Public pages always use DataContext (JSON only).
 * Admin pages always use AdminDataContext.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_MODE, apiFetch } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP } from "@/api/endpoints";

// ── JSON seed data (imported at build time; used when MOCK_MODE = true) ──────
import achievementsJson from "@/api/mockData/achievements.json";
import researchesJson from "@/api/mockData/researches.json";
import experiencesJson from "@/api/mockData/experiences.json";
import positionsJson from "@/api/mockData/positions.json";
import coursesJson from "@/api/mockData/courses.json";
import blogsJson from "@/api/mockData/blogs.json";
import messagesJson from "@/api/mockData/messages.json";
import educationJson from "@/api/mockData/education.json";
import professorJson from "@/api/mockData/professor.json";
import aboutJson from "@/api/mockData/about.json";
import settingsJson from "@/api/mockData/settings.json";

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
function useAdminList(jsonData, apiUrl) {
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
function useAdminObject(jsonData, apiUrl) {
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
const AchievementsCtx = createContext([]);
const ResearchesCtx = createContext([]);
const ExperiencesCtx = createContext([]);
const PositionsCtx = createContext([]);
const CoursesCtx = createContext([]);
const BlogsCtx = createContext([]);
const MessagesCtx = createContext([]);
const EducationCtx = createContext([]);
const ProfessorCtx = createContext(null);
const AboutCtx = createContext(null);
const SettingsCtx = createContext(null);

// ── Public hooks (consumed by admin pages) ────────────────────────────────────
export const useAdminAchievements = () => useContext(AchievementsCtx);
export const useAdminResearches = () => useContext(ResearchesCtx);
export const useAdminExperiences = () => useContext(ExperiencesCtx);
export const useAdminPositions = () => useContext(PositionsCtx);
export const useAdminCourses = () => useContext(CoursesCtx);
export const useAdminBlogs = () => useContext(BlogsCtx);
export const useAdminMessages = () => useContext(MessagesCtx);
export const useAdminEducation = () => useContext(EducationCtx);
export const useAdminProfessor = () => useContext(ProfessorCtx);
export const useAdminAbout = () => useContext(AboutCtx);
export const useAdminSettings = () => useContext(SettingsCtx);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AdminDataProvider({ children }) {
  const achievements = useAdminList(achievementsJson, EP.achievements.list);
  const researches = useAdminList(researchesJson, EP.researches.list);
  const experiences = useAdminList(experiencesJson, EP.experiences.list);
  const positions = useAdminList(positionsJson, EP.positions.list);
  const courses = useAdminList(coursesJson, EP.courses.list);
  const blogs = useAdminList(blogsJson, EP.blogs.list);
  const messages = useAdminList(messagesJson, EP.messages.list);
  const education = useAdminList(educationJson, EP.education.list);
  const professor = useAdminObject(professorJson, EP.user.get);
  const about = useAdminObject(aboutJson, EP.about.get);
  const settings = useAdminObject(settingsJson, EP.settings.get);

  return (
    <AchievementsCtx.Provider value={achievements}>
      <ResearchesCtx.Provider value={researches}>
        <ExperiencesCtx.Provider value={experiences}>
          <PositionsCtx.Provider value={positions}>
            <CoursesCtx.Provider value={courses}>
              <BlogsCtx.Provider value={blogs}>
                <MessagesCtx.Provider value={messages}>
                  <EducationCtx.Provider value={education}>
                    <ProfessorCtx.Provider value={professor}>
                        <AboutCtx.Provider value={about}>
                          <SettingsCtx.Provider value={settings}>
                                {children}
                          </SettingsCtx.Provider>
                        </AboutCtx.Provider>
                      </ProfessorCtx.Provider>
                  </EducationCtx.Provider>
                </MessagesCtx.Provider>
              </BlogsCtx.Provider>
            </CoursesCtx.Provider>
          </PositionsCtx.Provider>
        </ExperiencesCtx.Provider>
      </ResearchesCtx.Provider>
    </AchievementsCtx.Provider>
  );
}
