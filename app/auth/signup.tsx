import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
  setLoading(true);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, university, graduation_year: year }
    }
  });
  console.log('data:', data);
  console.log('error:', error);
  if (error) alert(error.message);
  setLoading(false);
}

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
        join crash.
      </Text>
      <Text style={{ color: "gray", marginBottom: 40 }}>
        find your party tonight
      </Text>

      <TextInput
        placeholder="full name"
        value={name}
        onChangeText={setName}
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="university email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="university (e.g.University of Waterloo)"
        value={university}
        onChangeText={setUniversity}
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="graduation year (e.g. 25)"
        value={year}
        onChangeText={setYear}
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginBottom: 24,
        }}
      />

      <TouchableOpacity
        style={{
          padding: 16,
          backgroundColor: "#000",
          borderRadius: 12,
          alignItems: "center",
        }}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "signing up..." : "sign up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16, alignItems: "center", marginBottom: 40 }}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={{ color: "gray" }}>
          already have an account?{" "}
          <Text style={{ color: "#000", fontWeight: "bold" }}>log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
