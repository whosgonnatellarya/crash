import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

function privateOffset(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    lat: ((hash % 100) - 50) / 10000,
    lng: (((hash * 31) % 100) - 50) / 10000,
  };
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [parties, setParties] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    supabase
      .from("parties")
      .select("*, users!host_id(name)")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .then(({ data }) => setParties(data ?? []));

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    })();
  }, []);

  useEffect(() => {
    if (parties.length === 0 || !mapRef.current) return;
    const coords = parties.map((p) => {
      const offset = p.is_public ? { lat: 0, lng: 0 } : privateOffset(p.id);
      return { latitude: p.latitude + offset.lat, longitude: p.longitude + offset.lng };
    });
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 40, bottom: 220, left: 40 },
      animated: true,
    });
  }, [parties]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{ latitude: 43.4723, longitude: -80.5449, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
        showsUserLocation
        onPress={() => setSelected(null)}
      >
        {parties.map((p) => {
          const offset = p.is_public ? { lat: 0, lng: 0 } : privateOffset(p.id);
          return (
            <Marker
              key={p.id}
              coordinate={{
                latitude: p.latitude + offset.lat,
                longitude: p.longitude + offset.lng,
              }}
              pinColor={p.is_public ? "#000000" : "#888888"}
              onPress={(e) => {
                e.stopPropagation();
                setSelected(p);
              }}
            />
          );
        })}
      </MapView>

      <View style={{ position: "absolute", top: 0, left: 0, right: 0 }} pointerEvents="box-none">
        <SafeAreaView>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              margin: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {selected && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            paddingBottom: 40,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
            {selected.is_public ? selected.name : "private party nearby"}
          </Text>
          <Text style={{ color: "gray", marginBottom: 16 }}>
            {selected.is_public ? selected.location : "exact location hidden until approved"}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#000", borderRadius: 12, padding: 14, alignItems: "center" }}
            onPress={() => {
              setSelected(null);
              router.push(`/party/${selected.id}`);
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>view details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
