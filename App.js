import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { getMovies } from "./api";

const { width } = Dimensions.get("window");

export default function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    const currentPage = reset ? 1 : page;
    const newMovies = await getMovies(currentPage);

    if (newMovies.length > 0) {
      setMovies((prev) => (reset ? newMovies : [...prev, ...newMovies]));
      setPage(currentPage + 1);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMovies(true);
  };

  const renderMovie = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.year}>
          📅 {item.year} ⭐ {item.rating}
        </Text>
        <Text style={styles.description} numberOfLines={4}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OMDb Movies</Text>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderMovie}
        onEndReached={() => loadMovies()}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={
          loading && (
            <ActivityIndicator
              size="large"
              color="#f1c40f"
              style={{ margin: 20 }}
            />
          )
        }
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No se encontraron películas.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#f1c40f",
    alignItems: "center",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#262626",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  poster: {
    width: 120,
    height: 180,
  },
  info: {
    flex: 1,
    padding: 15,
    justifyContent: "flex-start",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  year: {
    color: "#f1c40f",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },
  description: {
    color: "#cccccc",
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
