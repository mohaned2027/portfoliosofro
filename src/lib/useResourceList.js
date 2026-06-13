import { useState, useEffect } from "react";

/**
 * Fetches a list resource from the API client on mount (i.e. whenever the table
 * page is navigated to). Works in both MOCK_MODE (local JSON store) and real API
 * mode, since it goes through the unified `api` client.
 *
 * @param {{ list: (q?: object) => Promise<{ data: any[] }> }} resource
 *        An api client resource, e.g. `api.blogs`.
 * @param {any[]} fallback Seed data for instant render (e.g. from context).
 * @returns {[any[], Function, boolean]} [items, setItems, loading]
 */
export function useResourceList(resource, fallback = []) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    resource
      .list({ pageSize: 999 })
      .then((res) => {
        if (active) setItems(res.data ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resource]);

  return [items, setItems, loading];
}
