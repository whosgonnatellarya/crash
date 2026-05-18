import PartyCard from "@/components/partycard";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

function isTonight(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// deterministic offset per party so private location doesn't jump each render
function privateOffset(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    lat: ((hash % 100) - 50) / 10000,
    lng: (((hash * 31) % 100) - 50) / 10000,
  };
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"hot" | "tonight" | "map">("hot");
  const [parties, setParties] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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

  useEffect(() => {
    if (activeTab !== "map") return;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, [activeTab]);

  const visibleParties =
    activeTab === "tonight"
      ? parties.filter((p) => isTonight(p.date_time))
      : parties;

  const mapParties = parties.filter((p) => p.latitude != null && p.longitude != null);

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
            backgroundColor: activeTab === "map" ? "lightgray" : "white",
          }}
          onPress={() => setActiveTab("map")}
        >
          <Text>map view</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "map" ? (
        <MapView
          style={{ flex: 1 }}
          region={
            userLocation
              ? { ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }
              : { latitude: 43.4723, longitude: -80.5449, latitudeDelta: 0.05, longitudeDelta: 0.05 }
          }
          showsUserLocation
        >
          {mapParties.map((p) => {
            const offset = p.is_public ? { lat: 0, lng: 0 } : privateOffset(p.id);
            return (
              <Marker
                key={p.id}
                coordinate={{
                  latitude: p.latitude + offset.lat,
                  longitude: p.longitude + offset.lng,
                }}
                title={p.is_public ? p.name : "private party nearby"}
                description={p.is_public ? p.location : "exact location hidden until approved"}
                pinColor={p.is_public ? "#000000" : "#888888"}
                onCalloutPress={() => router.push(`/party/${p.id}`)}
              />
            );
          })}
        </MapView>
      ) : (
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
      )}
    </View>
  );
}
