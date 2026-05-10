import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateParty() {
  const [isPublic, setIsPublic] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 60,
          marginBottom: 8,
        }}
      >
        create a party
      </Text>
      <Text style={{ color: "gray", marginBottom: 32 }}>
        fill in the details below
      </Text>

      <TextInput
        placeholder="party name"
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="date & time"
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="location"
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="description"
        multiline
        numberOfLines={4}
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
          height: 100,
        }}
      />
      <TextInput
        placeholder="restrictions (e.g. 21+, UW/WLU only)"
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 24,
        }}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>visibility</Text>
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setIsPublic(true)}
          style={{
            marginRight: 8,
            padding: 12,
            borderRadius: 12,
            backgroundColor: isPublic ? "#000" : "#f0f0f0",
          }}
        >
          <Text style={{ color: isPublic ? "white" : "black" }}>public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsPublic(false)}
          style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: !isPublic ? "#000" : "#f0f0f0",
          }}
        >
          <Text style={{ color: !isPublic ? "white" : "black" }}>private</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>entry</Text>
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setIsPaid(false)}
          style={{
            marginRight: 8,
            padding: 12,
            borderRadius: 12,
            backgroundColor: !isPaid ? "#000" : "#f0f0f0",
          }}
        >
          <Text style={{ color: !isPaid ? "white" : "black" }}>free</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsPaid(true)}
          style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: isPaid ? "#000" : "#f0f0f0",
          }}
        >
          <Text style={{ color: isPaid ? "white" : "black" }}>paid</Text>
        </TouchableOpacity>
      </View>

      {isPaid && (
        <TextInput
          placeholder="price ($)"
          keyboardType="numeric"
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            marginBottom: 24,
          }}
        />
      )}

      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "#000",
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 40,
        }}
        onPress={() => {}}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          create party
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
