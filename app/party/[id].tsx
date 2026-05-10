import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function PartyDetails() {
  return (
    <ScrollView>
      <Image
        source={{ uri: 'https://picsum.photos/400/200' }}
        style={{ width: '100%', height: 250 }}
      />
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Sigma Pi Darty</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 8 }}>free</Text>
        </View>

        <Text style={{ color: 'gray', marginTop: 4 }}>hosted by isha, UW '30</Text>
        <Text style={{ color: 'gray', marginTop: 4 }}>📅 10/09/2026</Text>
        <Text style={{ color: 'gray', marginTop: 4 }}>📍 approximate location only</Text>

        <Text style={{ fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>about</Text>
        <Text style={{ color: 'gray', lineHeight: 22 }}>come through for the best darty of the semester ;\) good vibes only!</Text>

        <Text style={{ fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>restrictions</Text>
        <Text style={{ color: 'gray' }}>UW/WLU students only · 18+</Text>

        <Text style={{ fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>attendees</Text>
        <Text style={{ color: 'gray' }}>32 people going</Text>

        <TouchableOpacity
          style={{ marginTop: 32, padding: 16, backgroundColor: '#000', borderRadius: 12, alignItems: 'center', marginBottom: 40 }}
          onPress={() => {}}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>request to join </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}