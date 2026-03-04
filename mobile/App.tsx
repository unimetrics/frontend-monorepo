import { SafeAreaView, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function App() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";

  return (
    <SafeAreaView
      style={[styles.safeArea, dark ? styles.safeAreaDark : styles.safeAreaLight]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, dark ? styles.textDark : styles.textLight]}>
          Unimetrics Mobile
        </Text>
        <Text
          style={[styles.subtitle, dark ? styles.textDarkMuted : styles.textLightMuted]}
        >
          Expo app is connected to the monorepo.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  safeArea: {
    flex: 1,
  },
  safeAreaDark: {
    backgroundColor: "#0B1220",
  },
  safeAreaLight: {
    backgroundColor: "#F8FAFC",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  textDark: {
    color: "#F8FAFC",
  },
  textDarkMuted: {
    color: "#CBD5E1",
  },
  textLight: {
    color: "#0F172A",
  },
  textLightMuted: {
    color: "#475569",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
});
