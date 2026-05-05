import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function GroupChat() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Sigma Pi Darty
        </Text>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold" }}>Jake</Text>
          <Text
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 12,
              marginTop: 4,
            }}
          >
            guys it's starting at 10!
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold" }}>Nicole</Text>
          <Text
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 12,
              marginTop: 4,
            }}
          >
            omg can't wait 🎉
          </Text>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          borderTopWidth: 1,
          borderColor: "#eee",
        }}
      >
        <TextInput
          placeholder="type a message..."
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: "#f0f0f0",
            borderRadius: 24,
            marginRight: 8,
          }}
        />
        <TouchableOpacity
          style={{ padding: 12, backgroundColor: "#000", borderRadius: 24 }}
          onPress={() => {}}
        >
          <Text style={{ color: "white" }}>send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
