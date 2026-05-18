import { router, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 60, left: 24 }}>
        <Text style={{ fontSize: 16 }}>← back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 24 }}>
        your ticket
      </Text>
      <QRCode value={requestId || 'invalid'} size={250} />
      <Text style={{ color: "gray", marginTop: 24 }}>
        show this at the entrance
      </Text>
    </View>
  );
}
