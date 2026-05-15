import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function GroupChat() {
  const { party_id, party_name } = useLocalSearchParams<{ party_id: string; party_name: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("messages")
        .select("id, content, created_at, user_id, users(name)")
        .eq("party_id", party_id)
        .order("created_at", { ascending: true });

      if (error) Alert.alert("error", error.message);
      else setMessages(data ?? []);
      setLoading(false);
    }

    init();

    const channel = supabase
      .channel(`groupchat:${party_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `party_id=eq.${party_id}` },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("id, content, created_at, user_id, users(name)")
            .eq("id", payload.new.id)
            .single();
          if (data) setMessages((prev) => [...prev, data]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [party_id]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  async function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed || !currentUserId) return;
    setText("");

    const { error } = await supabase.from("messages").insert({
      party_id,
      user_id: currentUserId,
      content: trimmed,
    });

    if (error) Alert.alert("error", error.message);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, padding: 16 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 60, marginBottom: 16 }}>
          {party_name ?? "group chat"}
        </Text>

        {messages.map((msg) => {
          const isMe = msg.user_id === currentUserId;
          return (
            <View
              key={msg.id}
              style={{
                marginBottom: 12,
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              {!isMe && (
                <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
                  {msg.users?.name ?? "unknown"}
                </Text>
              )}
              <Text
                style={{
                  backgroundColor: isMe ? "#000" : "#f0f0f0",
                  color: isMe ? "white" : "black",
                  padding: 10,
                  borderRadius: 12,
                  maxWidth: "75%",
                }}
              >
                {msg.content}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: "row", padding: 16, borderTopWidth: 1, borderColor: "#eee" }}>
        <TextInput
          placeholder="type a message..."
          value={text}
          onChangeText={setText}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: "#f0f0f0",
            borderRadius: 24,
            marginRight: 8,
          }}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={{ padding: 12, backgroundColor: "#000", borderRadius: 24, justifyContent: "center" }}
          onPress={sendMessage}
        >
          <Text style={{ color: "white" }}>send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
