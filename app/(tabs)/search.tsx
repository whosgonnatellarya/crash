import { View, Text, TouchableOpacity, TextInput} from "react-native";

export default function SearchScreen() {
  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="search for parties!" style={{ padding: 8, backgroundColor: "#f0f0f0", borderRadius: 8 }} />
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity style={{ marginRight: 8, padding: 8, backgroundColor: "#007AFF", borderRadius: 8 }}>
          <Text style={{ color: "white" }}>tonight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 8, padding: 8, backgroundColor: "#007AFF", borderRadius: 8 }}>
          <Text style={{ color: "white" }}>unpaid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 8, padding: 8, backgroundColor: "#007AFF", borderRadius: 8 }}>
          <Text style={{ color: "white" }}>open to all</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}