import PartyCard from "@/components/partycard";
import { FlatList, View, Text, TouchableOpacity} from "react-native";
import { useState } from 'react'; 

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('hot')
  const parties = [
    {
      id: 1,
      name: "frosh1",
      host: "person a",
      price: 0,
      image: "https://picsum.photos/300/200",
      isPaid: true,
      restrictions: "none",
      dateTime: "10/09/2026",
      filter: 'hot',
    },
    {
      id: 2,
      name: "frosh1",
      host: "person a",
      price: 0,
      image: "https://picsum.photos/300/200",
      isPaid: true,
      restrictions: "none",
      dateTime: "10/09/2026",
    },
    {
      id: 3,
      name: "frosh1",
      host: "person a",
      price: 0,
      image: "https://picsum.photos/300/200",
      isPaid: true,
      restrictions: "none",
      dateTime: "10/09/2026",
    },
  ];
  return (
    <View style={{ padding: 16 }}>
      <Text> hey there, name! </Text>
      
      <View style={{ flexDirection: "row"}}> 
         <TouchableOpacity style={{ marginRight: 8, padding: 8, borderRadius: 20, borderWidth: 1, backgroundColor: activeTab === 'map' ? 'lightgray' : 'white' }} onPress={() => setActiveTab('map')}>
          <Text>map view</Text>
        </TouchableOpacity>
         <TouchableOpacity style={{ marginRight: 8, padding: 8, borderRadius: 20, borderWidth: 1, backgroundColor: activeTab === 'hot' ? 'lightgray' : 'white' }} onPress={() => setActiveTab('hot')}>
          <Text>hot rn!</Text>
        </TouchableOpacity>
         <TouchableOpacity style={{ marginRight: 8, padding: 8, borderRadius: 20, borderWidth: 1, backgroundColor: activeTab === 'tonight' ? 'lightgray' : 'white' }} onPress={() => setActiveTab('tonight')}>
          <Text>happening tonight!</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={parties}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PartyCard
            name={item.name}
            host={item.host}
            price={item.price}
            image={item.image}
            isPaid={item.isPaid}
            restrictions={item.restrictions}
            dateTime={item.dateTime}
          />
        )}
      />
    </View>
  );
}
