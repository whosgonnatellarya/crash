import PartyCard from "@/components/partycard";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [tonight, setTonight] = useState(false);
  const [unpaid, setUnpaid] = useState(false);
  const [openToAll, setOpenToAll] = useState(false);
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchParties() {
    setLoading(true);

    let q = supabase
      .from("parties")
      .select("*, users!host_id(name)")
      .order("created_at", { ascending: false });

    if (query.trim()) {
      q = q.ilike("name", `%${query.trim()}%`);
    }

    if (tonight) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
      q = q.gte("date_time", start).lte("date_time", end);
    }

    if (unpaid) {
      q = q.eq("is_paid", false);
    }

    if (openToAll) {
      q = q.eq("is_public", true);
    }

    const { data, error } = await q;
    if (!error) setParties(data ?? []);
    setLoading(false);
  }

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchParties();
  }, [tonight, unpaid, openToAll]);

  // Re-fetch on focus (in case parties were added)
  useFocusEffect(useCallback(() => { fetchParties(); }, []));

  function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginRight: 8,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: active ? "#000" : "#ccc",
          backgroundColor: active ? "#000" : "white",
        }}
      >
        <Text style={{ color: active ? "white" : "#333", fontSize: 13, fontWeight: active ? "600" : "400" }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>search</Text>

        <TextInput
          placeholder="search for parties..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchParties}
          returnKeyType="search"
          style={{
            padding: 14,
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            marginBottom: 12,
            fontSize: 15,
          }}
        />

        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <FilterChip label="tonight" active={tonight} onPress={() => setTonight((v) => !v)} />
          <FilterChip label="free" active={unpaid} onPress={() => setUnpaid((v) => !v)} />
          <FilterChip label="open to all" active={openToAll} onPress={() => setOpenToAll((v) => !v)} />
        </View>
      </View>

      {!loading && parties.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "gray" }}>no parties found.</Text>
        </View>
      ) : (
        <FlatList
          data={parties}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
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
      )}
    </SafeAreaView>
  );
}
