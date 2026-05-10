import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: 60 }}>crash. </Text>
      <Text style={{ color: 'gray', marginTop: 8, marginBottom: 40 }}>find your party tonight</Text>

      <TextInput
        placeholder="university email"
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
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => {}}>
        <Text style={{ color: 'gray' }}>don't have an account? <Text style={{ color: '#000', fontWeight: 'bold' }}>sign up!</Text></Text>
      </TouchableOpacity>
    </View>
  );
}