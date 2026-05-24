import DateTimePicker from "@react-native-community/datetimepicker";
import { getPublicUser, supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

export default function EditProfile() {
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [picUri, setPicUri] = useState<string | null>(null);
  const [existingPic, setExistingPic] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublicUser().then((user) => {
      if (!user) return;
      setUserId(user.id);
      setName(user.name ?? "");
      setUniversity(user.university ?? "");
      setGraduationYear(user.graduation_year ? String(user.graduation_year) : "");
      if (user.dob) setDob(new Date(user.dob));
      if (user.profile_pic) setExistingPic(user.profile_pic);
    });
  }, []);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("permission needed", "allow photo access to upload a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPicUri(result.assets[0].uri);
    }
  }

  async function uploadAvatar(uri: string, uid: string): Promise<string | null> {
    try {
      const ext = uri.split(".").pop() ?? "jpg";
      const path = `${uid}.${ext}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, arrayBuffer, { contentType: `image/${ext}`, upsert: true });
      if (error) { Alert.alert("upload error", error.message); return null; }
      return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    } catch (e: any) {
      Alert.alert("upload error", e.message ?? "failed to upload");
      return null;
    }
  }

  const dobLabel = dob
    ? dob.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "date of birth";

  function onDobChange(_: any, selected?: Date) {
    if (Platform.OS === "android") setShowDobPicker(false);
    if (selected) setDob(selected);
  }

  async function handleSave() {
    if (!userId) return;
    setLoading(true);

    let profilePicUrl = existingPic;
    if (picUri) {
      profilePicUrl = await uploadAvatar(picUri, userId);
      if (!profilePicUrl) { setLoading(false); return; }
    }

    const { error } = await supabase
      .from("users")
      .update({
        name,
        university,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        dob: dob ? dob.toISOString().split("T")[0] : null,
        profile_pic: profilePicUrl,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      Alert.alert("error", error.message);
    } else {
      router.back();
    }
  }

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 60, marginBottom: 16 }}>
        <Text style={{ fontSize: 16 }}>← back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>edit profile</Text>
      <Text style={{ color: "gray", marginBottom: 24 }}>update your details</Text>

      <TouchableOpacity onPress={pickImage} style={{ alignSelf: "center", marginBottom: 32 }}>
        {picUri || existingPic ? (
          <Image
            source={{ uri: picUri ?? existingPic! }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "gray", fontSize: 13 }}>add photo</Text>
          </View>
        )}
        <Text style={{ textAlign: "center", color: "gray", fontSize: 13, marginTop: 6 }}>tap to change</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="name"
        value={name}
        onChangeText={setName}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="university"
        value={university}
        onChangeText={setUniversity}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="graduation year (e.g. 2026)"
        value={graduationYear}
        onChangeText={setGraduationYear}
        keyboardType="numeric"
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 12 }}
      />

      <TouchableOpacity
        onPress={() => setShowDobPicker(true)}
        style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 12, marginBottom: 32 }}
      >
        <Text style={{ color: "gray", fontSize: 12, marginBottom: 2 }}>date of birth</Text>
        <Text style={{ color: dob ? "black" : "gray" }}>{dobLabel}</Text>
      </TouchableOpacity>

      {Platform.OS === "android" && showDobPicker && (
        <DateTimePicker
          value={dob ?? new Date(2000, 0, 1)}
          mode="date"
          maximumDate={new Date()}
          onChange={onDobChange}
        />
      )}

      {Platform.OS === "ios" && showDobPicker && (
        <Modal transparent animationType="slide">
          <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" }}>
            <View style={{ backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <TouchableOpacity
                onPress={() => setShowDobPicker(false)}
                style={{ alignItems: "flex-end", padding: 16 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>done</Text>
              </TouchableOpacity>
              <DateTimePicker
                value={dob ?? new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={onDobChange}
              />
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "#000",
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 40,
          opacity: loading ? 0.6 : 1,
        }}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "saving..." : "save"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
