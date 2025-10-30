import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "878638099277-khrl2jsmhpleaskb56fabj8e838juq3d.apps.googleusercontent.com",
    androidClientId: "878638099277-khrl2jsmhpleaskb56fabj8e838juq3d.apps.googleusercontent.com",
    webClientId: "878638099277-khrl2jsmhpleaskb56fabj8e838juq3d.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@my11084/TodoApp",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Firebase sign-in error:", error);
          setLoading(false);
        });
    }
  }, [response]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 10 }}>Signing in...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>{user.displayName}</Text>
        <Button title="Sign Out" onPress={() => auth.signOut()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Google Sign-In Test</Text>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()}
        color="#4285F4"
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
});
