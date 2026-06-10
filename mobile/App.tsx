import { View, Text, Button } from "react-native";

export default function App() {
  return (
    <View style={{ padding: 40 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Shigosag Mobile POS
      </Text>
      <Button title="Checkout" onPress={() => alert("Checkout")} />
    </View>
  );
}