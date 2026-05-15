import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [attendedCount, setAttendedCount] = useState(0);
  const [hostedCount, setHostedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const [profileRes, attendedRes, hostedRes] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase.from("requests").select("id", { count: "exact" }).eq("user_id", user.id).eq("status", "approved"),
        supabase.from("parties").select("id", { count: "exact" }).eq("host_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
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
    </ScrollView>
  );
}
