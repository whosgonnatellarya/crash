import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 24 }}>
        your ticket
      </Text>
      <QRCode value="dummy-party-id-123" size={250} />
      <Text style={{ color: "gray", marginTop: 24 }}>
        show this at the entrance
      </Text>
    </View>
  );
}
