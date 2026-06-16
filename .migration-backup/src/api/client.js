/**
 * client.js — unified API client
 *
 *  MOCK_MODE = true  → in-memory store seeded from JSON (no network calls)
 *  MOCK_MODE = false → calls real backend via apiFetch / DASHBOARD_ENDPOINTS
 */
import seedProfessor from "./mockData/professor.json";
import seedAbout from "./mockData/about.json";
import seedEducation from "./mockData/education.json";
import seedExperiences from "./mockData/experiences.json";
import seedCourses from "./mockData/courses.json";
import seedResearches from "./mockData/researches.json";
import seedAchievements from "./mockData/achievements.json";
import seedBlogs from "./mockData/blogs.json";
import seedMessages from "./mockData/messages.json";
import seedPositions from "./mockData/positions.json";
import seedSettings from "./mockData/settings.json";

import { MOCK_MODE, apiFetch, setAuthToken } from "@/api/request";
import {
  DASHBOARD_ENDPOINTS as EP,
  PORTFOLIO_ENDPOINTS as PUB,
} from "@/api/endpoints";

// ── Helpers (mock only) ───────────────────────────────────────────────────────
const LATENCY = 350;
const delay = (data, ms = LATENCY) =>
  new Promise((res) => setTimeout(() => res(structuredClone(data)), ms));

// In-memory store — only used when MOCK_MODE = true
const store = {
  professor: structuredClone(seedProfessor),
  about: structuredClone(seedAbout),
  settings: structuredClone(seedSettings),
  education: structuredClone(seedEducation),
  achievements: structuredClone(seedAchievements),
  experiences: structuredClone(seedExperiences),
  researches: structuredClone(seedResearches),
  positions: structuredClone(seedPositions),
  courses: structuredClone(seedCourses),
  blogs: structuredClone(seedBlogs),
  messages: structuredClone(seedMessages),
};

function paginate(items, q = {}) {
  let out = [...items];
  if (q.search) {
    const s = q.search.toLowerCase();
    out = out.filter((it) =>
      Object.values(it).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(s),
      ),
    );
  }
  if (q.filter) {
    for (const [k, v] of Object.entries(q.filter)) {
      if (v) out = out.filter((it) => String(it[k]) === v);
    }
  }
  if (q.sortBy) {
    out.sort((a, b) => {
      const av = a[q.sortBy],
        bv = b[q.sortBy];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (q.sortDir === "desc" ? -1 : 1);
    });
  }
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 12;
  const total = out.length;
  return {
    data: out.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ── Endpoint map for real API ────────────────────────────────────────────────
const EP_MAP = {
  achievements: EP.achievements,
  researches: EP.researches,
  experiences: EP.experiences,
  positions: EP.positions,
  courses: EP.courses,
  lectures: EP.lectures,
  blogs: EP.blogs,
  education: EP.education,
};

// Public show endpoints (no auth required) for detail pages
const PUB_SHOW = {
  achievements: PUB.achievements?.show,
  researches: PUB.researches?.show,
  courses: PUB.courses?.show,
  lectures: PUB.lectures?.show,
  blogs: PUB.blogs?.show,
};

/** 
 * Extract the first array value from a response object 
 * and return the full unwrapped data object if possible.
 */
function normalizeResponse(res) {
  // If backend returned { status, message, data: { key: [...] } }
  // We want to return { data: [...], total, ... }
  const payload = res?.data || res;
  
  if (Array.isArray(payload)) return { data: payload, total: payload.length };
  
  if (payload && typeof payload === "object") {
    // Find the first array property (e.g. researches, blogs)
    for (const [k, v] of Object.entries(payload)) {
      if (Array.isArray(v)) {
        return {
          data: v,
          total: payload.count || v.length,
          page: 1,
          pageSize: v.length,
          totalPages: 1
        };
      }
    }
  }
  
  return { data: [], total: 0 };
}

/** 
 * Prepares payload for backend. 
 * If it contains a File or array of Files, converts to FormData.
 * Also handles Laravel _method spoofing for PUT/PATCH with files.
 */
function preparePayload(data, method = "POST") {
  // Ensure we don't send internal fields
  const payload = { ...data };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload._avatarPreview;

  // Handle special fields that need JSON serialization
  if (payload.social_links && typeof payload.social_links === 'object') {
    payload.social_links = JSON.stringify(payload.social_links);
  }

  const hasFile = Object.values(payload).some(
    v => v instanceof File || (Array.isArray(v) && v[0] instanceof File)
  );

  if (!hasFile) return { body: payload, method };

  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      // If it's a file array (like gallery), append each
      if (v[0] instanceof File) {
        v.forEach(item => fd.append(`${k}[]`, item));
      } else {
        // For simple arrays like skills[] or authors[], backend might expect multiple appends or JSON
        v.forEach(item => fd.append(`${k}[]`, item));
      }
    } else if (v !== null && v !== undefined) {
      fd.append(k, v);
    }
  });

  // Laravel multipart PUT workaround: Use POST with _method=PUT
  if (method === "PUT" || method === "PATCH") {
    fd.append("_method", method);
    return { body: fd, method: "POST" };
  }

  return { body: fd, method };
}

// ── Generic CRUD factory ─────────────────────────────────────────────────────
function crud(key) {
  if (!MOCK_MODE) {
    const ep = EP_MAP[key];
    return {
      list: async (_q) => {
        const res = await apiFetch(ep.list, "GET");
        return normalizeResponse(res);
      },
      get: async (id) => {
        const pubShow = PUB_SHOW[key];
        const url = pubShow ? pubShow(id) : ep.show(id);
        const res = await apiFetch(url, "GET");
        return res?.data || res;
      },
      create: async (payload) => {
        const { body, method } = preparePayload(payload, "POST");
        const res = await apiFetch(ep.store, method, body);
        return res?.data || res;
      },
      update: async (id, payload) => {
        const { body, method } = preparePayload(payload, "PUT");
        const res = await apiFetch(ep.update(id), method, body);
        return res?.data || res;
      },
      remove: async (id) => {
        const res = await apiFetch(ep.delete(id), "DELETE");
        return res?.data || res;
      },
    };
  }

  // ── Mock implementation ──
  return {
    list: (q) => delay(paginate(store[key], q)),
    get: async (itemId) => {
      const found = store[key].find((x) => x.id === itemId);
      if (!found) throw new Error("Not found");
      return delay(found);
    },
    create: async (payload) => {
      const item = { ...payload, id: uid(String(key).slice(0, 3)) };
      store[key].unshift(item);
      return delay(item);
    },
    update: async (itemId, payload) => {
      const arr = store[key];
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      arr[idx] = { ...arr[idx], ...payload };
      return delay(arr[idx]);
    },
    remove: async (itemId) => {
      const arr = store[key];
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      const [removed] = arr.splice(idx, 1);
      return delay(removed);
    },
  };
}

// ── Public API object ────────────────────────────────────────────────────────
export const api = {
  auth: MOCK_MODE
    ? {
        login: async (email, password) => {
          await delay(null, 600);
          if (email && password.length >= 4) {
            const token = btoa(`${email}:${Date.now()}`);
            return {
              token,
              user: { id: "u-1", name: "Karim Mansour", email, role: "admin" },
            };
          }
          throw new Error("Invalid credentials");
        },
        forgotPassword: (email) => delay({ ok: true, email }, 500),
        resetPassword: (_token, _password) => delay({ ok: true }, 500),
        profile: () => delay(store.professor),
      }
    : {
        login: async (email, password) => {
          const res = await apiFetch(EP.auth.login, "POST", { email, password });
          const data = res?.data || res;
          if (data?.token) setAuthToken(data.token);
          return { token: data.token, user: data.user };
        },
        forgotPassword: (email) =>
          apiFetch(EP.auth.forgotPassword, "POST", { email }),
        verifyOtp: (email, otp) =>
          apiFetch(EP.auth.verifyOtp, "POST", { email, otp }),
        resetPassword: (email, password, password_confirmation) =>
          apiFetch(EP.auth.resetPassword, "POST", {
            email,
            password,
            password_confirmation,
          }),
        profile: async () => {
           const res = await apiFetch(EP.user.get, "GET");
           return res?.data || res;
        },
      },

  professor: MOCK_MODE
    ? {
        get: () => delay(store.professor),
        update: async (payload) => {
          store.professor = { ...store.professor, ...payload };
          return delay(store.professor);
        },
      }
    : {
        get: async () => {
          const res = await apiFetch(EP.user.get, "GET");
          return res?.data || res;
        },
        update: async (payload) => {
          const { body, method } = preparePayload(payload, "PUT");
          const res = await apiFetch(EP.user.update, method, body);
          return res?.data || res;
        },
      },

  about: MOCK_MODE
    ? {
        get: () => delay(store.about),
        update: async (payload) => {
          store.about = { ...store.about, ...payload };
          return delay(store.about);
        },
      }
    : {
        get: async () => {
          const res = await apiFetch(EP.about.get, "GET");
          const data = res?.data || res;
          // singleton about returns data.about as array or object
          return Array.isArray(data?.about) ? data.about[0] : (data?.about || data);
        },
        update: async (payload) => {
          const { body, method } = preparePayload(payload, "PUT");
          const res = await apiFetch(EP.about.update, method, body);
          return res?.data || res;
        },
      },

  settings: MOCK_MODE
    ? {
        get: () => delay(store.settings),
        update: async (payload) => {
          store.settings = { ...store.settings, ...payload };
          return delay(store.settings);
        },
      }
    : {
        get: async () => {
          const res = await apiFetch(EP.settings.get, "GET");
          const data = res?.data || res;
          // singleton settings returns data.settings as array or object
          return Array.isArray(data?.settings) ? data.settings[0] : (data?.settings || data);
        },
        update: async (payload) => {
          const { body, method } = preparePayload(payload, "PUT");
          const res = await apiFetch(EP.settings.update, method, body);
          return res?.data || res;
        },
      },

  education: crud("education"),
  achievements: crud("achievements"),
  experiences: crud("experiences"),
  researches: crud("researches"),
  positions: crud("positions"),
  courses: crud("courses"),
  lectures: crud("lectures"),
  blogs: crud("blogs"),

  messages: MOCK_MODE
    ? {
        ...crud("messages"),
        markRead: async (mid) => {
          const m = store.messages.find((x) => x.id === mid);
          if (m) m.read_at = new Date().toISOString();
          return delay(m);
        },
      }
    : {
        list: async (_q) => {
          const res = await apiFetch(EP.messages.list, "GET");
          return normalizeResponse(res);
        },
        get: async (id) => {
          const res = await apiFetch(EP.messages.list + `/${id}`, "GET");
          return res?.data || res;
        },
        remove: async (id) => {
          const res = await apiFetch(EP.messages.delete(id), "DELETE");
          return res?.data || res;
        },
        markRead: async (id) => {
          const res = await apiFetch(EP.messages.read(id), "PATCH");
          return res?.data || res;
        },
      },

  contact: MOCK_MODE
    ? {
        send: async (payload) => {
          store.messages.unshift({
            ...payload,
            id: uid("msg"),
            date: new Date().toISOString().slice(0, 10),
            read: false,
          });
          return delay({ ok: true });
        },
      }
    : {
        send: async (payload) => {
          const res = await apiFetch(PUB.contactUs.store, "POST", payload);
          return res?.data || res;
        },
      },
};
