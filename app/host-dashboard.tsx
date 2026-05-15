import { getPublicUser, supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HostDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const user = await getPublicUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("requests")
      .select("id, status, party_id, user_id, users(name, university, graduation_year), parties!inner(name, host_id)")
      .eq("parties.host_id", user.id)
      .eq("status", "pending");

    if (error) Alert.alert("error", error.message);
    else setRequests(data ?? []);
    setLoading(false);
  }

  async function updateStatus(requestId: string, status: "approved" | "denied") {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      Alert.alert("error", error.message);
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
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
      <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 60, marginBottom: 4 }}>
        host dashboard
      </Text>
      <Text style={{ color: "gray", marginBottom: 32 }}>
        {requests.length} pending request{requests.length !== 1 ? "s" : ""}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>requests</Text>

      {requests.length === 0 && (
        <Text style={{ color: "gray" }}>no pending requests</Text>
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
    </ScrollView>
  );
}
