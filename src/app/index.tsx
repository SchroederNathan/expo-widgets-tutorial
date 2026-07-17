import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import HydrationWidget from "../../widgets/HydrationWidget";

const GOAL = 64;

export default function HomeScreen() {
  const [progress, setProgress] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    HydrationWidget.updateSnapshot({progress, goal: GOAL})
  }, [progress])

  const ratio = Math.min(progress / GOAL, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>{progress}</Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onLayout={(e) => setButtonWidth(e.nativeEvent.layout.width)}
        onPress={() => setProgress((p) => Math.min(p + 8, GOAL))}
      >
        <View style={[styles.fill, { width: buttonWidth * ratio }]} />
        <Text style={styles.buttonText}>Add 8 oz</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#e7eef2",
    paddingHorizontal: 28,
  },
  amount: {
    fontSize: 88,
    fontWeight: "700",
    letterSpacing: -3,
    color: "#0c1a22",
    lineHeight: 92,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    marginBottom: 36,
  },
  button: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c1a22",
    borderRadius: 18,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#1a7a8c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
