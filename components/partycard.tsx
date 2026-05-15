import React from "react";
import { Image, Text, View } from "react-native";

function formatDateTime(str: string) {
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date} · ${time}`;
}

type Props = {
  name: string;
  host: string;
  price: number | null;
  image: string | null;
  isPaid: boolean;
  restrictions: string | null;
  dateTime: string;
};

export default function PartyCard({ name, host, price, image, isPaid, restrictions, dateTime }: Props) {
  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        marginBottom: 16,
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {image ? (
        <Image source={{ uri: image }} style={{ width: "100%", height: 180 }} />
      ) : (
        <View style={{ width: "100%", height: 180, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#aaa", fontSize: 13 }}>no image</Text>
        </View>
      )}

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", flexShrink: 1, marginRight: 8 }}>{name}</Text>
          <View style={{ backgroundColor: isPaid ? "#000" : "#e8f5e9", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: isPaid ? "white" : "#2e7d32", fontWeight: "600", fontSize: 13 }}>
              {isPaid ? `$${price}` : "free"}
            </Text>
          </View>
        </View>

        <Text style={{ color: "gray", fontSize: 13, marginBottom: 2 }}>📅 {formatDateTime(dateTime)}</Text>
        <Text style={{ color: "gray", fontSize: 13, marginBottom: 2 }}>hosted by {host}</Text>
        {restrictions ? (
          <Text style={{ color: "gray", fontSize: 13 }}>🔒 {restrictions}</Text>
        ) : null}
      </View>
    </View>
  );
}
