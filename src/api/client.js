/**
 * Mock API client — simulates a real HTTP layer with latency, errors,
 * pagination, search, sort, and CRUD. Built on top of an in-memory store
 * seeded from src/data/mockData.ts so screens behave as if a backend exists.
 */
import {
  achievements as seedAchievements,
  experiences as seedExperiences,
  researches as seedResearches,
  positions as seedPositions,
  courses as seedCourses,
  blogs as seedBlogs,
  messages as seedMessages,
  media as seedMedia,
  professor as seedProfessor,
  education as seedEducation,
  dashboardCharts,
  stats,
} from "@/data/mockData";
import seedSettings from "./mockData/settings.json";

const LATENCY = 350;
const delay =     (data   , ms = LATENCY)             =>
  new Promise((res) => setTimeout(() => res(structuredClone(data)), ms));

              
                                  
                                
                                  
                                        
                                      
                                    
                                  
                              
                          
                                
                          
  

const store        = {
  professor: structuredClone(seedProfessor),
  settings: structuredClone(seedSettings),
  education: structuredClone(seedEducation)       ,
  achievements: structuredClone(seedAchievements),
  experiences: structuredClone(seedExperiences),
  researches: structuredClone(seedResearches),
  positions: structuredClone(seedPositions),
  courses: structuredClone(seedCourses),
  blogs: structuredClone(seedBlogs),
  messages: structuredClone(seedMessages),
  media: structuredClone(seedMedia),
};

                         
                  
                  
                           
                
                    
                                              
  

function paginate                               (items     , q            = {}) {
  let out = [...items];
  if (q.search) {
    const s = q.search.toLowerCase();
    out = out.filter((it) =>
      Object.values(it).some((v) => typeof v === "string" && v.toLowerCase().includes(s)),
    );
  }
  if (q.filter) {
    for (const [k, v] of Object.entries(q.filter)) {
      if (v) out = out.filter((it) => String(it[k]) === v);
    }
  }
  if (q.sortBy) {
    out.sort((a, b) => {
      const av = a[q.sortBy ]; const bv = b[q.sortBy ];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (q.sortDir === "desc" ? -1 : 1);
    });
  }
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 12;
  const total = out.length;
  const data = out.slice((page - 1) * pageSize, page * pageSize);
  return { data, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

const id = (prefix        ) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function crud                       (key   ) {
                                                       
  return {
    list: (q            ) => delay(paginate(store[key]         , q)),
    get: async (itemId        ) => {
      const found = (store[key]         ).find((x) => x.id === itemId);
      if (!found) throw new Error("Not found");
      return delay(found     );
    },
    create: async (payload            ) => {
      const item = { ...payload, id: id(String(key).slice(0, 3)) }     ;
      (store[key]         ).unshift(item);
      return delay(item);
    },
    update: async (itemId        , payload            ) => {
      const arr = store[key]         ;
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      arr[idx] = { ...arr[idx], ...payload };
      return delay(arr[idx]     );
    },
    remove: async (itemId        ) => {
      const arr = store[key]         ;
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      const [removed] = arr.splice(idx, 1);
      return delay(removed     );
    },
  };
}

export const api = {
  auth: {
    login: async (email        , password        ) => {
      await delay(null, 600);
      if (email && password.length >= 4) {
        const token = btoa(`${email}:${Date.now()}`);
        return { token, user: { id: "u-1", name: "Karim Mansour", email, role: "admin"          } };
      }
      throw new Error("Invalid credentials");
    },
    forgotPassword: (email        ) => delay({ ok: true, email }, 500),
    resetPassword: (_token        , _password        ) => delay({ ok: true }, 500),
    profile: () => delay(store.professor),
  },
  professor: {
    get: () => delay(store.professor),
    update: async (payload                                 ) => {
      store.professor = { ...store.professor, ...payload };
      return delay(store.professor);
    },
  },
  settings: {
    get: () => delay(store.settings),
    update: async (payload                                ) => {
      store.settings = { ...store.settings, ...payload };
      return delay(store.settings);
    },
  },
  education: crud("education"),
  achievements: crud("achievements"),
  experiences: crud("experiences"),
  researches: crud("researches"),
  positions: crud("positions"),
  courses: crud("courses"),
  blogs: crud("blogs"),
  messages: {
    ...crud("messages"),
    markRead: async (mid        , read         ) => {
      const m = store.messages.find((x) => x.id === mid);
      if (m) m.read = read;
      return delay(m);
    },
  },
  media: crud("media"),
  contact: {
    send: async (payload                                                                ) => {
      store.messages.unshift({ ...payload, id: id("msg"), date: new Date().toISOString().slice(0, 10), read: false });
      return delay({ ok: true });
    },
  },
  dashboard: {
    stats: () =>
      delay({
        ...stats,
        totalAchievements: store.achievements.length,
        totalResearches: store.researches.length,
        totalCourses: store.courses.length,
        totalLectures: store.courses.reduce((n, c) => n + c.lectures.length, 0),
        totalBlogs: store.blogs.length,
        totalMessages: store.messages.length,
        unreadMessages: store.messages.filter((m) => !m.read).length,
      }),
    charts: () => delay(dashboardCharts),
    recentActivities: () => delay(dashboardCharts.recentActivities),
  },
};

                             
