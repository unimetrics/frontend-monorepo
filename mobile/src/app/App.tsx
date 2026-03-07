import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-ui-color-text text-2xl font-bold">
          Welcome to Unimetrics Mobile!
        </Text>
      </View>
    </SafeAreaView>
  );
}
