import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HostDashboard() {
  const requests = [
    { id: 1, name: "arya", uni: "UW", year: "'30" },
    { id: 2, name: "Sarah", uni: "UW", year: "'26" },
    { id: 3, name: "Jake", uni: "UW", year: "'27" },
  ];

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 60,
          marginBottom: 4,
        }}
      >
        Sigma Pi Darty
      </Text>
      <Text style={{ color: "gray", marginBottom: 32 }}>32 people going</Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        requests
      </Text>

      {requests.map((person) => (
        <View
          key={person.id}
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
          <View>
            <Text style={{ fontWeight: "bold" }}>{person.name}</Text>
            <Text style={{ color: "gray" }}>
              {person.uni} {person.year}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: "#000",
                borderRadius: 8,
                marginRight: 8,
              }}
              onPress={() => {}}
            >
              <Text style={{ color: "white" }}>accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: "#ff3b30",
                borderRadius: 8,
              }}
              onPress={() => {}}
            >
              <Text style={{ color: "white" }}>deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
