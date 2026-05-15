import { getPublicUser, supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

type Notification = {
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      const user = await getPublicUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [attendeeRes, hostRes] = await Promise.all([
        // requests I sent that were approved or denied
        supabase
          .from("requests")
          .select("id, status, created_at, parties(name)")
          .eq("user_id", user.id)
          .in("status", ["approved", "denied"])
          .order("created_at", { ascending: false }),

        // pending requests to parties I host
        supabase
          .from("requests")
          .select("id, status, created_at, users(name), parties!inner(name, host_id)")
          .eq("parties.host_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
      ]);

      const attendeeNotifs: Notification[] = (attendeeRes.data ?? []).map((r: any) => ({
        id: `attendee-${r.id}`,
        title: r.status === "approved"
          ? `your request to ${r.parties?.name ?? "a party"} was accepted!`
          : `your request to ${r.parties?.name ?? "a party"} was denied.`,
        subtitle: r.parties?.name ?? "",
        created_at: r.created_at,
      }));

      const hostNotifs: Notification[] = (hostRes.data ?? []).map((r: any) => ({
        id: `host-${r.id}`,
        title: `${r.users?.name ?? "someone"} wants to join ${r.parties?.name ?? "your party"}`,
        subtitle: r.parties?.name ?? "",
        created_at: r.created_at,
      }));

      const all = [...attendeeNotifs, ...hostNotifs].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(all);
      setLoading(false);
    }

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 60, marginBottom: 16 }}>
        notifications
      </Text>

      {notifications.length === 0 && (
        <Text style={{ color: "gray" }}>nothing here yet</Text>
      )}

      {notifications.map((n) => (
        <View
          key={n.id}
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{n.title}</Text>
          <Text style={{ color: "gray", marginTop: 4 }}>{timeAgo(n.created_at)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
