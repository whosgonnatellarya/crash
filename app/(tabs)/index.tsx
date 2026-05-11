import PartyCard from "@/components/partycard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

//this is basically the homescreen!!
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("hot");
  supabase
    .from("parties")
    .select("*")
    .then(({ data, error }) => {
      console.log(data, error);
    });
  const [parties, setParties] = useState([]);

  useEffect(() => {
    supabase
      .from("parties")
      .select("*")
      .then(({ data, error }) => {
        console.log("data:", data);
        console.log("error:", error);
        if (error) console.log(error);
        else setParties(data);
      });
  }, []);
  return (
    <View style={{ padding: 16 }}>
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PartyCard
            name={item.name}
            host={item.host_id}
            price={item.price}
            image={item.image_url}
            isPaid={item.is_paid}
            restrictions={item.restrictions}
            dateTime={new Date(item.date_time).toLocaleDateString()}
          />
        )}
      />
    </View>
  );
}
