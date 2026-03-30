import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMovies } from "./api";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("Marvel");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (search.length > 2) {
        await loadMovies(true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const loadMovies = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    const nextPage = reset ? 1 : page;
    const data = await getMovies(nextPage, search || "Marvel");
    setMovies((prev) => (reset ? data : [...prev, ...data]));
    setPage(nextPage + 1);
    setLoading(false);

    if (search && search.trim().length > 0 && search !== "Marvel") {
      saveSearch(search);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMovies(true);
    } catch (error) {
      Alert.alert("Connection Error", "Unable to load the movies");
    } finally {
      setRefreshing(false);
    }
  };

  const saveSearch = async (query) => {
    try {
      const history = (await AsyncStorage.getItem("search_history")) || "[]";
      let searches = JSON.parse(history);

      searches = [query, ...searches.filter((s) => s !== query)].slice(0, 5);

      await AsyncStorage.setItem("search_history", JSON.stringify(searches));
    } catch (e) {
      console.error(e);
    }
  };

  const MovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedMovie(item)}
    >
      <Image source={{ uri: item.image }} style={styles.poster} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardYear}>
          {item.year} • ⭐ {item.rating}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Movie..."
          placeholderTextColor="#888"
          value={search === "Marvel" ? "" : search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <MovieCard item={item} />}
        onEndReached={() => loadMovies()}
        ListFooterComponent={loading && <ActivityIndicator color="#f1c40f" />}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
      />
      <Modal visible={!!selectedMovie} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedMovie(null)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedMovie && (
                <>
                  <Image
                    source={{ uri: selectedMovie.image }}
                    style={styles.modalImage}
                  />

                  <View style={styles.modalTextContainer}>
                    <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                    <Text style={styles.modalSub}>
                      {selectedMovie.genre} • {selectedMovie.year}
                    </Text>
                    <Text style={styles.modalPlot}>
                      {selectedMovie.description}
                    </Text>
                    <Text style={styles.modalDirector}>
                      Director: {selectedMovie.director}
                    </Text>

                    <TouchableOpacity
                      style={styles.trailerBtn}
                      onPress={() => alert("Opening YouTube...")}
                    >
                      <Text style={styles.trailerBtnText}>▶ Watch Trailer</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingTop: 30,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: 15,
    width: "100%",
    maxWidth: 500,
  },
  searchInput: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 45,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    marginBottom: 25,
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  poster: { width: 100, height: 150, margin: 16 },
  cardInfo: { flex: 1, padding: 8 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 25 },
  cardYear: { color: "#f1c40f", marginVertical: 4, fontSize: 13 },
  cardDesc: { color: "#aaa", fontSize: 12, lineHeight: 16 },
  modalContent: {
    backgroundColor: "#121212",
    borderColor: "#444",
    width: "80%",
    maxWidth: 350,
    maxHeight: "80%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  modalImage: {
    width: 180,
    height: 270,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  modalTextContainer: { padding: 20 },
  modalTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  modalSub: { color: "#f1c40f", marginVertical: 8 },
  modalPlot: { color: "#ccc", fontSize: 15, lineHeight: 22 },
  modalDirector: { color: "#888", marginTop: 15, fontStyle: "italic" },
  trailerBtn: {
    backgroundColor: "#f1c40f",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  trailerBtnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  closeBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 15,
    zIndex: 10,
  },
  closeBtnText: {
    color: "#f1c40f",
    fontWeight: "bold",
    fontSize: 16,
  },
});
