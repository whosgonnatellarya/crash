import { getPublicUser, supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';

export default function PartyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [party, setParty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [userRequest, setUserRequest] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const [{ data: partyData, error }, currentUser] = await Promise.all([
        supabase.from('parties').select('*').eq('id', id).single(),
        getPublicUser(),
      ]);
      if (error) Alert.alert('error', error.message);
      else {
        setParty(partyData);
        if (currentUser && partyData) {
          const host = currentUser.id === partyData.host_id;
          setIsHost(host);
          if (!host) {
            const { data: reqData } = await supabase
              .from('requests')
              .select('id, status')
              .eq('party_id', id)
              .eq('user_id', currentUser.id)
              .maybeSingle();
            setUserRequest(reqData);
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleRequestJoin() {
    setRequesting(true);
    const user = await getPublicUser();
    if (!user) {
      Alert.alert('account not found', "your profile wasn't found in the database. try signing out and signing up again.");
      setRequesting(false);
      return;
    }

    const { data: newReq, error } = await supabase
      .from('requests')
      .insert({ party_id: id, user_id: user.id, status: 'pending' })
      .select('id')
      .single();

    setRequesting(false);
    if (error) {
      Alert.alert('error', error.message);
    } else {
      setUserRequest({ id: newReq.id, status: 'pending' });
      router.push(`/waitlist?partyId=${id}&requestId=${newReq.id}`);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!party) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ fontSize: 16 }}>← back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'gray' }}>party not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const chatUrl = `/groupchat?party_id=${id}&party_name=${encodeURIComponent(party.name)}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>← back</Text>
      </TouchableOpacity>
      <ScrollView>
        <View style={{ padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', flexShrink: 1 }}>{party.name}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 8, marginLeft: 8 }}>
              {party.is_paid ? `$${party.price}` : 'free'}
            </Text>
          </View>

          <Text style={{ color: 'gray', marginTop: 4 }}>
            {'📅 ' + (() => {
              const d = new Date(party.date_time);
              return isNaN(d.getTime())
                ? party.date_time
                : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
                  ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            })()}
          </Text>
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

          {isHost ? (
            <>
              <TouchableOpacity
                style={{ marginTop: 32, padding: 16, backgroundColor: '#000', borderRadius: 12, alignItems: 'center' }}
                onPress={() => router.push('/host-dashboard')}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>manage party</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: 12, padding: 16, backgroundColor: '#222', borderRadius: 12, alignItems: 'center', marginBottom: 40 }}
                onPress={() => router.push(chatUrl as any)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>group chat</Text>
              </TouchableOpacity>
            </>
          ) : userRequest?.status === 'approved' ? (
            <>
              <TouchableOpacity
                style={{ marginTop: 32, padding: 16, backgroundColor: '#000', borderRadius: 12, alignItems: 'center' }}
                onPress={() => router.push(chatUrl as any)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>group chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: 12, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, alignItems: 'center', marginBottom: 40 }}
                onPress={() => router.push(`/waitlist?partyId=${id}&requestId=${userRequest.id}` as any)}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>view your ticket</Text>
              </TouchableOpacity>
            </>
          ) : userRequest?.status === 'pending' ? (
            <TouchableOpacity
              style={{ marginTop: 32, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, alignItems: 'center', marginBottom: 40 }}
              onPress={() => router.push(`/waitlist?partyId=${id}&requestId=${userRequest.id}` as any)}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>request pending — view status</Text>
            </TouchableOpacity>
          ) : userRequest?.status === 'denied' ? (
            <View style={{ marginTop: 32, marginBottom: 40, alignItems: 'center' }}>
              <Text style={{ color: 'gray', fontSize: 16 }}>your request was denied.</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                marginTop: 32, padding: 16, backgroundColor: '#000', borderRadius: 12,
                alignItems: 'center', marginBottom: 40, opacity: requesting ? 0.6 : 1,
              }}
              onPress={handleRequestJoin}
              disabled={requesting}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                {requesting ? 'sending...' : 'request to join'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
