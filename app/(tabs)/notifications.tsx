import { ScrollView, Text, View } from "react-native";

export default function Notifications() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        notifications
      </Text>
      <View
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>isha accepted your request!</Text>
        <Text style={{ color: "gray", marginTop: 4 }}>
          sigma pi darty · just now
        </Text>
      </View>
      <View
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>
          you've been added to the group chat
        </Text>
        <Text style={{ color: "gray", marginTop: 4 }}>
          sigma pi darty · 2 mins ago
        </Text>
      </View>
    </ScrollView>
  );
}
