import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function Signup() {
  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 60 }}>join crash. </Text>
      <Text style={{ color: 'gray', marginTop: 8, marginBottom: 40 }}>find your party tonight</Text>

      <TextInput
        placeholder="full name"
        style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="university email"
        style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="university (e.g. NYU)"
        style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="year (e.g. '25)"
        style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="password"
        secureTextEntry
        style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 24 }}
      />

      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#000', borderRadius: 12, alignItems: 'center' }}
        onPress={() => {}}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16, alignItems: 'center', marginBottom: 40 }} onPress={() => {}}>
        <Text style={{ color: 'gray' }}>already have an account? <Text style={{ color: '#000', fontWeight: 'bold' }}>log in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}