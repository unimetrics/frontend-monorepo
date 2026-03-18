import "../../global.css";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="bg-bg-page flex-1 items-center justify-center px-6">
      <Text className="text-text-heading text-center text-3xl font-semibold">
        Unimetrics Mobile
      </Text>
      <Text className="text-text-default mt-3 text-center text-base">
        Design tokens from @unimetrics/design-tokens are active in this workspace.
      </Text>
    </View>
  );
}
