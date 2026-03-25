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
} from "react-native";
import { getMovies } from "./api";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("Marvel");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadMovies(true);
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
      />

      <Modal
        visible={!!selectedMovie}
        animationType="slide"
        transparent={false}
      >
        {selectedMovie && (
          <View style={styles.modalContent}>
            <ScrollView>
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
                  <Text style={styles.trailerBtnText}>▶ Watch Tráiler</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedMovie(null)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f", paddingTop: 30 },
  searchContainer: { padding: 15 },
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
    marginHorizontal: 35,
    marginBottom: 25,
    borderRadius: 25,
    overflow: "hidden",
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
    flex: 1,
    backgroundColor: "#0f0f0f",
    marginTop: 30,
    marginBottom: 30,
    width: 600,
    height: 300,
    alignSelf: "center",
    overflow: "hidden",
  },
  modalImage: { width: "100%", height: 200 },
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
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
  closeBtnText: { color: "#fff", fontWeight: "bold" },
});
