import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Unimetrics Mobile with SSH!!!</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// TODO: remove after re-enabling NativeWind (restore className props)
const styles = StyleSheet.create({
  container: { backgroundColor: "#6b7280", flex: 1 }, // bg-gray-500
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: { color: "#000", fontSize: 24, fontWeight: "bold" },
});
