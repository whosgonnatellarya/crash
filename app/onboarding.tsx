import { Text, TouchableOpacity, View } from "react-native";

export default function Onboarding() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 64, marginBottom: 16 }}>🎉</Text>
      <Text style={{ fontSize: 48, fontWeight: "bold", marginBottom: 8 }}>
        crash
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: "gray",
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        transforming the college nightlife scene
      </Text>

      <TouchableOpacity
        style={{
          width: "100%",
          padding: 16,
          backgroundColor: "#000",
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
        onPress={() => {}}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          get started
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: "100%",
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          alignItems: "center",
        }}
        onPress={() => {}}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>log in</Text>
      </TouchableOpacity>
    </View>
  );
}
