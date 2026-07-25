import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTable<T = any>(table: string, opts?: {
  filter?: (q: any) => any;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}) {
  const [data, setData] = useState<T[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let q: any = (supabase as any).from(table).select("*");
      if (opts?.filter) q = opts.filter(q);
      if (opts?.order) q = q.order(opts.order.column, { ascending: !!opts.order.ascending });
      if (opts?.limit) q = q.limit(opts.limit);
      const { data } = await q;
      if (!cancelled) setData((data ?? []) as T[]);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);
  return data;
}

export function useSingleton<T = any>(table: string, id: string | number = 1) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from(table).select("*").eq("id", id).maybeSingle();
      setData(data as T);
    })();
  }, [table, id]);
  return data;
}

export function useSettings() {
  const [values, setValues] = useState<Record<string, any>>({});
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value ?? {}; });
      setValues(map);
    })();
  }, []);
  return values;
}
