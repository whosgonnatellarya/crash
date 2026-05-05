import { View, Text, ScrollView } from 'react-native';

export default function Profile() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', marginRight: 16 }} />
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>name</Text>
          <Text style={{ color: 'gray' }}>uni, year</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>0</Text>
          <Text style={{ color: 'gray' }}>parties attended</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>0</Text>
          <Text style={{ color: 'gray' }}>parties hosted</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>upcoming parties</Text>
    </ScrollView>
  );
}