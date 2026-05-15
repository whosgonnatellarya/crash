import PartyCard from "@/components/partycard";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

//this is basically the homescreen!!
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("hot");
  const [parties, setParties] = useState([]);

  useFocusEffect(
    useCallback(() => {
      supabase
        .from("parties")
        .select("*, users!host_id(name)")
        .then(({ data, error }) => {
          if (!error) setParties(data);
        });
    }, [])
  );
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text> hey there, name! </Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 20,
            borderWidth: 1,
            backgroundColor: activeTab === "map" ? "lightgray" : "white",
          }}
          onPress={() => setActiveTab("map")}
        >
          <Text>map view</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 20,
            borderWidth: 1,
            backgroundColor: activeTab === "hot" ? "lightgray" : "white",
          }}
          onPress={() => setActiveTab("hot")}
        >
          <Text>hot rn!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 20,
            borderWidth: 1,
            backgroundColor: activeTab === "tonight" ? "lightgray" : "white",
          }}
          onPress={() => setActiveTab("tonight")}
        >
          <Text>happening tonight!</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={parties}
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
  );
}
