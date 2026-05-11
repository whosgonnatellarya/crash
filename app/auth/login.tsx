import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 60,
          marginBottom: 8,
        }}
      >
        crash 🎉
      </Text>
      <Text style={{ color: "gray", marginBottom: 40 }}>
        find your party tonight
      </Text>

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
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "logging in..." : "log in"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16, alignItems: "center" }}
        onPress={() => router.push("/auth/signup")}
      >
        <Text style={{ color: "gray" }}>
          don't have an account?{" "}
          <Text style={{ color: "#000", fontWeight: "bold" }}>sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
