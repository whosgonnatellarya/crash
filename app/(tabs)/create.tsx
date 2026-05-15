import DateTimePicker from "@react-native-community/datetimepicker";
import { getPublicUser, supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateParty() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });

  function onDateChange(_: any, selected?: Date) {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) setDate(selected);
  }

  function onTimeChange(_: any, selected?: Date) {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selected) setDate(selected);
  }

  async function handleSubmit() {
    if (!name || !location) {
      Alert.alert("missing fields", "name and location are required.");
      return;
    }

    setLoading(true);

    const user = await getPublicUser();
    if (!user) {
      Alert.alert("not logged in", "you need to be logged in to create a party.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parties").insert({
      name,
      date_time: date.toISOString(),
      location,
      description,
      restrictions,
      is_public: isPublic,
      is_paid: isPaid,
      price: isPaid ? parseFloat(price) || null : null,
      host_id: user.id,
    });

    setLoading(false);

    if (error) {
      Alert.alert("error", error.message);
    } else {
      setName("");
      setDate(new Date());
      setLocation("");
      setDescription("");
      setRestrictions("");
      setIsPublic(true);
      setIsPaid(false);
      setPrice("");
      Alert.alert("party created!", "your party is live.", [
        { text: "ok", onPress: () => router.push("/(tabs)") },
      ]);
    }
  }

  const pickerMode = showDatePicker ? "date" : "time";
  const showPicker = showDatePicker || showTimePicker;

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 60, marginBottom: 8 }}>
        create a party
      </Text>
      <Text style={{ color: "gray", marginBottom: 32 }}>fill in the details below</Text>

      <TextInput
        placeholder="party name"
        value={name}
        onChangeText={setName}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 12 }}
      />

      {/* Date & Time pickers */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => { setShowTimePicker(false); setShowDatePicker(true); }}
          style={{ flex: 1, padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12 }}
        >
          <Text style={{ color: "gray", fontSize: 12, marginBottom: 2 }}>date</Text>
          <Text>{dateLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setShowDatePicker(false); setShowTimePicker(true); }}
          style={{ flex: 1, padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12 }}
        >
          <Text style={{ color: "gray", fontSize: 12, marginBottom: 2 }}>time</Text>
          <Text>{timeLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Android: render inline (shows as native dialog) */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker value={date} mode="date" onChange={onDateChange} />
      )}
      {Platform.OS === "android" && showTimePicker && (
        <DateTimePicker value={date} mode="time" onChange={onTimeChange} />
      )}

      {/* iOS: bottom sheet modal */}
      {Platform.OS === "ios" && showPicker && (
        <Modal transparent animationType="slide">
          <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" }}>
            <View style={{ backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <TouchableOpacity
                onPress={() => { setShowDatePicker(false); setShowTimePicker(false); }}
                style={{ alignItems: "flex-end", padding: 16 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>done</Text>
              </TouchableOpacity>
              <DateTimePicker
                value={date}
                mode={pickerMode}
                display="spinner"
                onChange={pickerMode === "date" ? onDateChange : onTimeChange}
              />
            </View>
          </View>
        </Modal>
      )}

      <TextInput
        placeholder="location"
        value={location}
        onChangeText={setLocation}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 12, height: 100 }}
      />
      <TextInput
        placeholder="restrictions (e.g. 21+, UW/WLU only)"
        value={restrictions}
        onChangeText={setRestrictions}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 24 }}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>visibility</Text>
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setIsPublic(true)}
          style={{ marginRight: 8, padding: 12, borderRadius: 12, backgroundColor: isPublic ? "#000" : "#f0f0f0" }}
        >
          <Text style={{ color: isPublic ? "white" : "black" }}>public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsPublic(false)}
          style={{ padding: 12, borderRadius: 12, backgroundColor: !isPublic ? "#000" : "#f0f0f0" }}
        >
          <Text style={{ color: !isPublic ? "white" : "black" }}>private</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>entry</Text>
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setIsPaid(false)}
          style={{ marginRight: 8, padding: 12, borderRadius: 12, backgroundColor: !isPaid ? "#000" : "#f0f0f0" }}
        >
          <Text style={{ color: !isPaid ? "white" : "black" }}>free</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsPaid(true)}
          style={{ padding: 12, borderRadius: 12, backgroundColor: isPaid ? "#000" : "#f0f0f0" }}
        >
          <Text style={{ color: isPaid ? "white" : "black" }}>paid</Text>
        </TouchableOpacity>
      </View>

      {isPaid && (
        <TextInput
          placeholder="price ($)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 24 }}
        />
      )}

      <TouchableOpacity
        style={{
          padding: 16, backgroundColor: "#000", borderRadius: 12,
          alignItems: "center", marginBottom: 40, opacity: loading ? 0.6 : 1,
        }}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "creating..." : "create party"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
