import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Index() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/tabs/home");
      } else {
        setCheckingAuth(false);
      }
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>Checking user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://www.transparenttextures.com/patterns/axiom-pattern.png" }}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.contentBox}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.brand}>TODO APP</Text>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={() => router.push("/login")}
            >
              <Ionicons
                name="arrow-forward-circle"
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.text}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  contentBox: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#272424ff",
    letterSpacing: 1,
  },
  brand: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1c1c1dff",
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 144, 226, 0.9)",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: "#4A90E2",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
