import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Waitlist() {
  return (
    <ScrollView>
      <Image
        source={{ uri: "https://picsum.photos/400/200" }}
        style={{ width: "100%", height: 200 }}
      />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sigma Pi Darty</Text>
        <Text style={{ color: "gray" }}>hosted by Jake, NYU '25</Text>
        <Text style={{ color: "gray" }}>10/09/2026</Text>

        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>your status</Text>
          <Text style={{ marginTop: 8, color: "gray" }}>not joined yet</Text>
        </View>

        <TouchableOpacity
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: "#000",
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() => {}}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            request to join
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
