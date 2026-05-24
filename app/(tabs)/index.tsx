import PartyCard from "@/components/partycard";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

function isTonight(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"hot" | "tonight">("hot");
  const [parties, setParties] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      supabase
        .from("parties")
        .select("*, users!host_id(name)")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error) setParties(data ?? []);
        });
    }, [])
  );

  const visibleParties =
    activeTab === "tonight"
      ? parties.filter((p) => isTonight(p.date_time))
      : parties;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", padding: 16, paddingBottom: 8, marginTop: 16 }}>
        <TouchableOpacity
          style={{
            marginRight: 8, padding: 8, borderRadius: 20, borderWidth: 1,
            backgroundColor: activeTab === "hot" ? "lightgray" : "white",
          }}
          onPress={() => setActiveTab("hot")}
        >
          <Text>hot rn!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginRight: 8, padding: 8, borderRadius: 20, borderWidth: 1,
            backgroundColor: activeTab === "tonight" ? "lightgray" : "white",
          }}
          onPress={() => setActiveTab("tonight")}
        >
          <Text>happening tonight!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 8, borderRadius: 20, borderWidth: 1,
            backgroundColor: "white",
          }}
          onPress={() => router.push("/map")}
        >
          <Text>map view</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {activeTab === "tonight" && visibleParties.length === 0 && (
          <Text style={{ color: "gray", textAlign: "center", marginTop: 40 }}>no parties tonight 😴</Text>
        )}
        <FlatList
          data={visibleParties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/party/${item.id}`)}>
              <PartyCard
                name={item.name}
                host={item.users?.name ?? "unknown"}
                price={item.price}
                image={item.image_url}
                isPaid={item.is_paid}
                restrictions={item.restrictions}
                dateTime={item.date_time}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
