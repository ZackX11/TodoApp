import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (!usr) router.replace("/login");
      else setUser(usr);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", "Unable to log out: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={80} color="#4a90e2" />
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={{ flex: 1 }} />
    
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ef0606ff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFF",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 70, 
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 10,
  },
  emailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: "center",
    width: "90%",
    justifyContent: "center",
  },
  logoutText: {
    color: "#ef0606ff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
