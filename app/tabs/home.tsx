import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";

interface Todo {
  id: string;
  title: string;
  task: string;
  completed: boolean;
  timestamp?: any;
}

const HomeScreen: React.FC = () => {
  const [inputVisible, setInputVisible] = useState(false);
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [uid, setUid] = useState<string | null>(null);

  const rotation = useRef(new Animated.Value(0)).current;
  const unsubscribeSnapshotRef = useRef<() => void | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnapshotRef.current) {
        try {
          unsubscribeSnapshotRef.current();
        } catch { }
        unsubscribeSnapshotRef.current = null;
      }

      if (user && user.uid) {
        setUid(user.uid);
        unsubscribeSnapshotRef.current = subscribeToTodos(user.uid);
      } else {
        setUid(null);
        setTodos([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshotRef.current) {
        unsubscribeSnapshotRef.current();
        unsubscribeSnapshotRef.current = null;
      }
    };
  }, []);

  const subscribeToTodos = (userId: string) => {
    try {
      const todosRef = collection(db, "root", "Todo", "user", userId, "tasks");
      const q = query(todosRef, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const todosData: Todo[] = snapshot.docs.map((d) => ({
            ...(d.data() as Todo),
            id: d.id,
          }));
          setTodos(todosData);
        },
        (error) => {
          console.error("onSnapshot error:", error);
          Alert.alert("Sync error", "Unable to sync tasks: " + error.message);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error("subscribeToTodos error:", err);
      Alert.alert(
        "Error",
        "Failed to subscribe to tasks: " + (err.message || err)
      );
      return () => { };
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    if (!uid) {
      Alert.alert("Not signed in", "Please sign in to add tasks.");
      return;
    }

    const [title, ...rest] = input.split("\n");
    const task = rest.join("\n") || "";

    try {
      await addDoc(collection(db, "root", "Todo", "user", uid, "tasks"), {
        title: title.trim(),
        task: task.trim(),
        completed: false,
        timestamp: serverTimestamp(),
      });
      setInput("");
      setInputVisible(false);
    } catch (error: any) {
      console.error("Error adding todo:", error);
      Alert.alert("Add failed", error.message ?? "Unable to add task");
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!uid) return;
    try {
      const todoRef = doc(db, "root", "Todo", "user", uid, "tasks", id);
      await updateDoc(todoRef, { completed: !completed });
    } catch (error: any) {
      console.error("Error toggling todo:", error);
      Alert.alert("Update failed", error.message ?? "Unable to update task");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!uid) return;
    try {
      const todoRef = doc(db, "root", "Todo", "user", uid, "tasks", id);
      await deleteDoc(todoRef);
    } catch (error: any) {
      console.error("Error deleting todo:", error);
      Alert.alert("Delete failed", error.message ?? "Unable to delete task");
    }
  };

  const handleFabPress = () => {
    setInputVisible((prev) => !prev);
    Animated.timing(rotation, {
      toValue: inputVisible ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodo(item.id, item.completed)}>
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={item.completed ? "#4caf50" : "#b0b0b0"}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            styles.todoTitle,
            { textDecorationLine: item.completed ? "line-through" : "none" },
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.todoTask}>{item.task}</Text>
      </View>

      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Ionicons name="trash-outline" size={22} color="#e53935" />
      </TouchableOpacity>
    </View>
  );

  const remainingTasks = todos.filter((t) => !t.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>To-Do List</Text>
        <Text style={styles.subText}>{remainingTasks} tasks left</Text>
      </View>

      {inputVisible && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter title & details..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={addTodo}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Animated.View style={{ transform: [{ rotate: rotationInterpolate }] }}>
          <Ionicons name="add" size={30} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="list" size={24} color="#4a90e2" />
          <Text style={styles.navTextActive}>to-do</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/tabs/profile")}
        >
          <Ionicons name="person-circle-outline" size={24} color="#aaa" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fa", paddingTop: 55 },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 35,
    fontWeight: "800",
    color: "#222",
  },
  subText: {
    color: "#666",
    fontSize: 18,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    padding: 10,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 14,
    marginVertical: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  todoTitle: { fontSize: 18, color: "#333", fontWeight: "600" },
  todoTask: { fontSize: 16, color: "#888", marginTop: 2 },
  fab: {
    position: "absolute",
    bottom: 85,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
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
