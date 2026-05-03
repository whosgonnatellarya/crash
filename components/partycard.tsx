import React from "react";
import { Image, Text, View } from "react-native";

export default function PartyCard({ name, host, price, image, isPaid, restrictions, dateTime }) {
  return (
    <View
      style={{
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#000000",
        padding: 20,
        width: "100%",
        height: 350,
      }}
    >
      <Text>{isPaid ? "Paid" : "Free"}</Text>
      <Text>{dateTime}</Text>
      <Image
        source={{ uri: image }}
        style={{ width: "100%", height: 200, borderRadius: 12 }}
      />
      <Text>{name}</Text>
      <Text>Posted by: {host}</Text>
      <Text>Restrictions: {restrictions}</Text>
    </View>
  );
}
