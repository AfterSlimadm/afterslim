"use client";

import { useEffect, useRef } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface UseRealtimeOptions<T extends Record<string, unknown>> {
  /** Supabase table name to subscribe to. */
  table: string;
  /** Optional schema (defaults to "public"). */
  schema?: string;
  /** Optional filter string, e.g. "order_id=eq.123". */
  filter?: string;
  /** Called when a new row is inserted. */
  onInsert?: (payload: T) => void;
  /** Called when an existing row is updated. */
  onUpdate?: (payload: T) => void;
  /** Called when a row is deleted. */
  onDelete?: (payload: T) => void;
  /** Set to false to temporarily disable the subscription. */
  enabled?: boolean;
}

/**
 * Generic Supabase Realtime subscription hook.
 * Subscribes to postgres_changes on a specific table and fires
 * the appropriate callback on INSERT / UPDATE / DELETE events.
 * Auto-cleans up the channel on unmount.
 */
export function useRealtime<T extends Record<string, unknown>>({
  table,
  schema = "public",
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Store latest callbacks in refs to avoid re-subscribing on every render
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);

  onInsertRef.current = onInsert;
  onUpdateRef.current = onUpdate;
  onDeleteRef.current = onDelete;

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();

    const channelName = `realtime:${schema}:${table}${filter ? `:${filter}` : ""}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes" as never,
        {
          event: "*",
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          switch (payload.eventType) {
            case "INSERT":
              onInsertRef.current?.(payload.new as T);
              break;
            case "UPDATE":
              onUpdateRef.current?.(payload.new as T);
              break;
            case "DELETE":
              onDeleteRef.current?.(payload.old as T);
              break;
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [table, schema, filter, enabled]);
}
