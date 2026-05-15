import { getPublicUser, supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [attendedCount, setAttendedCount] = useState(0);
  const [hostedCount, setHostedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const user = await getPublicUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [attendedRes, hostedRes] = await Promise.all([
        supabase.from("requests").select("id", { count: "exact" }).eq("user_id", user.id).eq("status", "approved"),
        supabase.from("parties").select("id", { count: "exact" }).eq("host_id", user.id),
      ]);

      setProfile(user);
      setAttendedCount(attendedRes.count ?? 0);
      setHostedCount(hostedRes.count ?? 0);
      setLoading(false);
    }

    fetchProfile();
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
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 60, marginBottom: 24 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#ccc", marginRight: 16 }} />
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{profile?.name ?? "—"}</Text>
          <Text style={{ color: "gray" }}>
            {profile?.university ?? ""}
            {profile?.graduation_year ? ` '${profile.graduation_year}` : ""}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 24 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>{attendedCount}</Text>
          <Text style={{ color: "gray" }}>parties attended</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>{hostedCount}</Text>
          <Text style={{ color: "gray" }}>parties hosted</Text>
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>upcoming parties</Text>

      {hostedCount > 0 && (
        <TouchableOpacity
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: "#000",
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() => router.push("/host-dashboard")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>host dashboard</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          marginTop: 32,
          marginBottom: 40,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ff3b30",
          alignItems: "center",
        }}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={{ color: "#ff3b30", fontWeight: "bold" }}>sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
