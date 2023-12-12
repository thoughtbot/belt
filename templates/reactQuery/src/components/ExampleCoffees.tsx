import { useQuery } from '@tanstack/react-query';
import { FlatList, Image, Text, View } from 'react-native';
import api, { Coffee as CoffeeType } from 'src/util/api/api';

// TODO: sample component, remove
export default function ExampleCoffees() {
  const { data } = useQuery({ queryKey: ['coffee'], queryFn: api.coffee });

  return (
    <>
      <Text style={{ fontWeight: '600', fontSize: 24 }}>Coffees</Text>
      <FlatList
        data={data?.slice(0, 4)}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => <Coffee coffee={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 0 }}
      />
    </>
  );
}

function Coffee({ coffee }: { coffee: CoffeeType }) {
  const { title, image } = coffee;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'salmon',
        borderRadius: 10,
        padding: 16,
        margin: 10,
      }}
    >
      <Text accessibilityRole="header" style={{ fontWeight: '600' }}>
        {title}
      </Text>
      <Image
        width={100}
        height={100}
        source={{ uri: image }}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}
