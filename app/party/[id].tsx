import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PartyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [party, setParty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    supabase
      .from('parties')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) Alert.alert('error', error.message);
        else setParty(data);
        setLoading(false);
      });
  }, [id]);

  async function handleRequestJoin() {
    setRequesting(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      Alert.alert('not logged in', 'you need to be logged in to request to join.');
      setRequesting(false);
      return;
    }

    const { error } = await supabase.from('requests').insert({
      party_id: id,
      user_id: user.id,
      status: 'pending',
    });

    setRequesting(false);
    if (error) Alert.alert('error', error.message);
    else Alert.alert('requested!', 'your request to join has been sent.');
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!party) return null;

  return (
    <ScrollView>
      <View style={{ padding: 24, marginTop: 60 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', flexShrink: 1 }}>{party.name}</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 8, marginLeft: 8 }}>
            {party.is_paid ? `$${party.price}` : 'free'}
          </Text>
        </View>

        <Text style={{ color: 'gray', marginTop: 4 }}>📅 {party.date_time}</Text>
        <Text style={{ color: 'gray', marginTop: 4 }}>📍 {party.location}</Text>
        <Text style={{ color: 'gray', marginTop: 4 }}>{party.is_public ? 'public' : 'private'}</Text>

        {party.description ? (
          <>
            <Text style={{ fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>about</Text>
            <Text style={{ color: 'gray', lineHeight: 22 }}>{party.description}</Text>
          </>
        ) : null}

        {party.restrictions ? (
          <>
            <Text style={{ fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>restrictions</Text>
            <Text style={{ color: 'gray' }}>{party.restrictions}</Text>
          </>
        ) : null}

        <TouchableOpacity
          style={{
            marginTop: 32,
            padding: 16,
            backgroundColor: '#000',
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 40,
            opacity: requesting ? 0.6 : 1,
          }}
          onPress={handleRequestJoin}
          disabled={requesting}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {requesting ? 'sending...' : 'request to join'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
