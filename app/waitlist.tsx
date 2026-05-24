import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

const STATUS_COLOR: Record<string, string> = {
  approved: '#22c55e',
  pending: '#f59e0b',
  denied: '#ef4444',
};

export default function Waitlist() {
  const { partyId, requestId } = useLocalSearchParams<{ partyId: string; requestId: string }>();
  const [party, setParty] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: partyData }, { data: reqData }] = await Promise.all([
        supabase.from('parties').select('*, users!host_id(name)').eq('id', partyId).single(),
        supabase.from('requests').select('id, status').eq('id', requestId).single(),
      ]);
      setParty(partyData);
      setRequest(reqData);
      setLoading(false);
    }
    load();
  }, [partyId, requestId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const status: string = request?.status ?? 'unknown';
  const color = STATUS_COLOR[status] ?? '#888';

  const dateLabel = (() => {
    if (!party?.date_time) return null;
    const d = new Date(party.date_time);
    if (isNaN(d.getTime())) return party.date_time;
    return (
      d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    );
  })();

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ fontSize: 16 }}>← back</Text>
      </TouchableOpacity>

      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
          {party?.name ?? 'party'}
        </Text>
        <Text style={{ color: 'gray' }}>hosted by {party?.users?.name ?? 'unknown'}</Text>
        {dateLabel ? <Text style={{ color: 'gray', marginTop: 4 }}>{dateLabel}</Text> : null}

        <View style={{ marginTop: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>your status</Text>
          <View style={{
            padding: 20,
            backgroundColor: color + '20',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: color,
            alignItems: 'center',
          }}>
            <Text style={{ color, fontWeight: 'bold', fontSize: 18 }}>{status}</Text>
          </View>
        </View>

        {status === 'approved' && requestId ? (
          <TouchableOpacity
            style={{ marginTop: 24, padding: 16, backgroundColor: '#000', borderRadius: 12, alignItems: 'center', marginBottom: 40 }}
            onPress={() => router.push(`/qrcode?requestId=${requestId}` as any)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>view your ticket</Text>
          </TouchableOpacity>
        ) : status === 'pending' ? (
          <>
            <Text style={{ color: 'gray', marginTop: 24, textAlign: 'center' }}>
              hang tight — the host will review your request soon.
            </Text>
            <TouchableOpacity
              style={{ marginTop: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ff3b30', alignItems: 'center', marginBottom: 40, opacity: cancelling ? 0.6 : 1 }}
              disabled={cancelling}
              onPress={() =>
                Alert.alert('cancel request', 'are you sure you want to withdraw your request?', [
                  { text: 'keep it', style: 'cancel' },
                  {
                    text: 'cancel request',
                    style: 'destructive',
                    onPress: async () => {
                      setCancelling(true);
                      const { error } = await supabase.from('requests').delete().eq('id', requestId);
                      setCancelling(false);
                      if (error) { Alert.alert('error', error.message); return; }
                      router.back();
                    },
                  },
                ])
              }
            >
              <Text style={{ color: '#ff3b30', fontWeight: 'bold', fontSize: 16 }}>
                {cancelling ? 'cancelling...' : 'cancel request'}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
