import React from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();

  const current = segments[segments.length - 1];

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/tabs/home")}
        >
          <Ionicons
            name="list"
            size={24}
            color={current === "home" ? "#4a90e2" : "#aaa"}
          />
          <Text
            style={[
              styles.navText,
              current === "home" && styles.navTextActive,
            ]}
          >
            to-do
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/tabs/profile")}
        >
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={current === "profile" ? "#4a90e2" : "#aaa"}
          />
          <Text
            style={[
              styles.navText,
              current === "profile" && styles.navTextActive,
            ]}
          >
            profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 8,
  },
  navButton: { alignItems: "center" },
  navText: { fontSize: 16, color: "#999", marginTop: 2 },
  navTextActive: { fontSize: 16, color: "#4a90e2", marginTop: 2 },
});
