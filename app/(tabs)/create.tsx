import DateTimePicker from "@react-native-community/datetimepicker";
import { getPublicUser, supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
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
  const [imageUri, setImageUri] = useState<string | null>(null);
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

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("permission needed", "allow photo access to upload a party image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function uploadImage(uri: string, userId: string): Promise<string | null> {
    try {
      const ext = uri.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const { error } = await supabase.storage
        .from("party-images")
        .upload(path, arrayBuffer, { contentType: `image/${ext}`, upsert: false });

      if (error) {
        Alert.alert("upload error", error.message);
        return null;
      }

      const { data } = supabase.storage.from("party-images").getPublicUrl(path);
      return data.publicUrl;
    } catch (e: any) {
      Alert.alert("upload error", e.message ?? "failed to upload image");
      return null;
    }
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

    let latitude: number | null = null;
    let longitude: number | null = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const results = await Location.geocodeAsync(location);
        if (results.length > 0) {
          latitude = results[0].latitude;
          longitude = results[0].longitude;
        }
      }
    } catch (_) {}

    let imageUrl: string | null = null;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri, user.id);
      if (!imageUrl) {
        setLoading(false);
        return;
      }
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
      latitude,
      longitude,
      image_url: imageUrl,
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
      setImageUri(null);
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

      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker value={date} mode="date" onChange={onDateChange} />
      )}
      {Platform.OS === "android" && showTimePicker && (
        <DateTimePicker value={date} mode="time" onChange={onTimeChange} />
      )}

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

      {/* Image picker */}
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>party image</Text>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 24,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          height: imageUri ? undefined : 100,
        }}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
        ) : (
          <Text style={{ color: "gray" }}>tap to add a photo</Text>
        )}
      </TouchableOpacity>
      {imageUri && (
        <TouchableOpacity onPress={() => setImageUri(null)} style={{ marginTop: -20, marginBottom: 24, alignItems: "center" }}>
          <Text style={{ color: "gray", fontSize: 13 }}>remove photo</Text>
        </TouchableOpacity>
      )}

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
