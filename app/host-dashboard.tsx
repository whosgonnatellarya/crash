import { getPublicUser, supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HostDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const user = await getPublicUser();
      if (!user) return;

      const { data: myParties } = await supabase
        .from("parties")
        .select("id, name")
        .eq("host_id", user.id);

      if (!myParties || myParties.length === 0) return;

      const partyIds = myParties.map((p: any) => p.id);

      const [pendingRes, approvedRes] = await Promise.all([
        supabase
          .from("requests")
          .select("id, status, party_id, user_id, users(name, university, graduation_year), parties(name)")
          .in("party_id", partyIds)
          .eq("status", "pending"),
        supabase
          .from("requests")
          .select("id, status, party_id, user_id, users(name, university, graduation_year), parties(name)")
          .in("party_id", partyIds)
          .eq("status", "approved"),
      ]);

      if (pendingRes.error) Alert.alert("error", pendingRes.error.message);
      else setRequests(pendingRes.data ?? []);

      if (!approvedRes.error) setApproved(approvedRes.data ?? []);
    } catch (e) {
      console.error("fetchRequests error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(requestId: string, status: "approved" | "denied") {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      Alert.alert("error", error.message);
      return;
    }

    const req = requests.find((r) => r.id === requestId);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    if (status === "approved" && req) {
      setApproved((prev) => [...prev, { ...req, status: "approved" }]);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 60, marginBottom: 16 }}>
        <Text style={{ fontSize: 16 }}>← back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 4 }}>
        host dashboard
      </Text>
      <Text style={{ color: "gray", marginBottom: 32 }}>
        {requests.length} pending · {approved.length} approved
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>pending requests</Text>

      {requests.length === 0 && (
        <Text style={{ color: "gray", marginBottom: 24 }}>no pending requests</Text>
      )}

      {requests.map((req) => (
        <View
          key={req.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{req.users?.name ?? "unknown"}</Text>
            <Text style={{ color: "gray" }}>
              {req.users?.university ?? ""}{req.users?.graduation_year ? ` '${req.users.graduation_year}` : ""}
            </Text>
            <Text style={{ color: "gray", fontSize: 12 }}>{req.parties?.name}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: "#000", borderRadius: 8, marginRight: 8 }}
              onPress={() => updateStatus(req.id, "approved")}
            >
              <Text style={{ color: "white" }}>accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: "#ff3b30", borderRadius: 8 }}
              onPress={() => updateStatus(req.id, "denied")}
            >
              <Text style={{ color: "white" }}>deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 16 }}>approved attendees</Text>

      {approved.length === 0 && (
        <Text style={{ color: "gray", marginBottom: 40 }}>no approved attendees yet</Text>
      )}

      {approved.map((req) => (
        <View
          key={req.id}
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{req.users?.name ?? "unknown"}</Text>
          <Text style={{ color: "gray" }}>
            {req.users?.university ?? ""}{req.users?.graduation_year ? ` '${req.users.graduation_year}` : ""}
          </Text>
          <Text style={{ color: "gray", fontSize: 12 }}>{req.parties?.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
