import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { getMovies } from "./api";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovies();
      setMovies(data);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.poster} />
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={2}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 50 },
  card: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  poster: { width: 200, height: 300, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});
