/*import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  Modal,
  Pressable,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Bus, MapPin, Activity } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext"; // import your theme context

const BusListScreen = ({ navigation }) => {
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("Bus No (Ascending)");
  const [routeFilter, setRouteFilter] = useState("All");

  const { light } = useContext(ThemeContext); // true = dark mode, false = light mode

  useEffect(() => {
    setBuses([
      {
        id: "1",
        busNo: 12,
        capacity: 50,
        route: "Hostel → Library → Academic Block → Canteen",
        status: "Running",
        nextStop: "Library",
        eta: "4 mins",
        startTiming: "08:00 AM",
        exitTiming: "04:00 PM",
      },
      {
        id: "2",
        busNo: 5,
        capacity: 45,
        route: "Main Gate → Auditorium → Hostel",
        status: "Ready",
        nextStop: "Main Gate",
        eta: "Starting soon",
        startTiming: "09:00 AM",
        exitTiming: "05:00 PM",
      },
      {
        id: "3",
        busNo: 8,
        capacity: 60,
        route: "Parking → Admin Block → Cafeteria → Hostel",
        status: "Inactive",
        nextStop: "-",
        eta: "-",
        startTiming: "07:30 AM",
        exitTiming: "03:30 PM",
      },
    ]);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredBuses = buses
    .filter((bus) => {
      const matchSearch =
        bus.busNo.toString().toLowerCase().includes(search.toLowerCase()) ||
        bus.route.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" || bus.status === statusFilter;
      const matchRoute =
        routeFilter === "All" || bus.route.includes(routeFilter);
      return matchSearch && matchStatus && matchRoute;
    })
    .sort((a, b) => {
      if (sortOption === "Bus No (Ascending)") return a.busNo - b.busNo;
      if (sortOption === "Bus No (Descending)") return b.busNo - a.busNo;
      if (sortOption === "ETA (Soonest)") {
        const etaA = parseInt(a.eta) || Infinity;
        const etaB = parseInt(b.eta) || Infinity;
        return etaA - etaB;
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "#0ab052ff"; // bright green
      case "Ready":
        return "#fbbf24"; // orange
      case "Inactive":
        return "#f87171"; // red
      default:
        return "#9ca3af"; // gray
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isDark ? "#1f2937" : "#fff" },
      ]}
      onPress={() => navigation.navigate("BusDetails", { busId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
       
            <View style={styles.row}>
              <Bus size={26} color="#30bcf8ff" />
              <Text style={styles.busNo}>Bus {item.busNo}</Text>
            </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        ><Activity size={14} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={[styles.route, { color: isDark ? "#d1d5db" : "#555" }]}>
        {item.route}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={isDark ? "#9ca3af" : "#555"} />
        <Text style={[styles.infoText, { color: isDark ? "#d1d5db" : "#444" }]}>
          Next Stop: {item.nextStop}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color={isDark ? "#9ca3af" : "#555"} />
        <Text style={[styles.infoText, { color: isDark ? "#d1d5db" : "#444" }]}>
          ETA: {item.eta}
        </Text>
      </View>

      <Text style={[styles.info, { color: isDark ? "#9ca3af" : "#6B7280" }]}>
        Start: {item.startTiming} | Exit: {item.exitTiming}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#f9fafb" },
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={28} color={light ? "#111827" : "#F9FAFB"} />
    </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? "#f9fafb" : "#111" }]}>
          Campus Bus List
        </Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons
            name="options-outline"
            size={24}
            color={isDark ? "#f9fafb" : "#111"}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? "#374151" : "#fff" },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={isDark ? "#d1d5db" : "#555"} />
        <TextInput
          placeholder="Search by bus number or route..."
          placeholderTextColor={isDark ? "#9ca3af" : "#888"}
          style={[styles.searchInput, { color: isDark ? "#f9fafb" : "#111" }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterTabs}>
        {["All", "Running", "Ready", "Inactive"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              { backgroundColor: isDark ? "#4b5563" : "#e5e7eb" },
              statusFilter === tab && {
                backgroundColor: tab === "Running" ? "#22c55e" : tab === "Ready" ? "#fbbf24" : "#30bcf8ff",
              },
            ]}
            onPress={() => setStatusFilter(tab)}
          >
            <Text
              style={[
                styles.filterText,
                { color: isDark ? "#f9fafb" : "#111" },
                statusFilter === tab && { color: "#fff" },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#f9fafb" : "#111"}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? "#9ca3af" : "#888" }]}>
            No buses found 🚍
          </Text>
        }
      />
    </View>
  );
};

export default BusListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 30 },
   row: { flexDirection: "row", alignItems: "center", marginBottom: 8,gap:10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  searchContainer: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10, elevation: 1 },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 15 },
  filterTabs: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  filterTab: { flex: 1, paddingVertical: 8, marginHorizontal: 3, borderRadius: 8, alignItems: "center" },
  filterText: { fontWeight: "500" },
  card: { borderRadius: 14, padding: 16, marginVertical: 6, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  busName: { fontSize: 17, fontWeight: "600" },
  statusBadge: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, minWidth: 70, justifyContent: "center" },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12, marginLeft: 4 },
  route: { marginVertical: 6 },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  infoText: { marginLeft: 6 },
  info: { fontSize: 13, marginBottom: 4,marginTop:10 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16 },
   backBtn: {position:"absolute",top:35, marginTop: 20 ,marginLeft:20},
});*/import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  Modal,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Bus, Activity } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext"; // theme context

const BusListScreen = ({ navigation }) => {
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("Bus No (Ascending)");
  const [routeFilter, setRouteFilter] = useState("All");

  const { light } = useContext(ThemeContext); // true = light mode, false = dark mode

  useEffect(() => {
    setBuses([
      {
        id: "1",
        busNo: 12,
        capacity: 50,
        route: "Hostel → Library → Academic Block → Canteen",
        status: "Running",
        nextStop: "Library",
        eta: "4 mins",
        startTiming: "08:00 AM",
        exitTiming: "04:00 PM",
      },
      {
        id: "2",
        busNo: 5,
        capacity: 45,
        route: "Main Gate → Auditorium → Hostel",
        status: "Ready",
        nextStop: "Main Gate",
        eta: "Starting soon",
        startTiming: "09:00 AM",
        exitTiming: "05:00 PM",
      },
      {
        id: "3",
        busNo: 8,
        capacity: 60,
        route: "Parking → Admin Block → Cafeteria → Hostel",
        status: "Inactive",
        nextStop: "-",
        eta: "-",
        startTiming: "07:30 AM",
        exitTiming: "03:30 PM",
      },
    ]);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredBuses = buses
    .filter((bus) => {
      const matchSearch =
        bus.busNo.toString().toLowerCase().includes(search.toLowerCase()) ||
        bus.route.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" || bus.status === statusFilter;
      const matchRoute =
        routeFilter === "All" || bus.route.includes(routeFilter);
      return matchSearch && matchStatus && matchRoute;
    })
    .sort((a, b) => {
      if (sortOption === "Bus No (Ascending)") return a.busNo - b.busNo;
      if (sortOption === "Bus No (Descending)") return b.busNo - a.busNo;
      if (sortOption === "ETA (Soonest)") {
        const etaA = parseInt(a.eta) || Infinity;
        const etaB = parseInt(b.eta) || Infinity;
        return etaA - etaB;
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "#0ab052ff"; // bright green
      case "Ready":
        return "#fbbf24"; // orange
      case "Inactive":
        return "#f87171"; // red
      default:
        return "#9ca3af"; // gray
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: light ? "#fff" : "#1f2937" },
      ]}
      onPress={() => navigation.navigate("BusDetails", { busId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.row}>
          <Bus size={26} color="#30bcf8ff" />
          <Text style={[styles.busNo, { color: light ? "#111" : "#f9fafb" }]}>
            Bus {item.busNo}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Activity size={14} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={[styles.route, { color: light ? "#555" : "#d1d5db" }]}>
        {item.route}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={light ? "#555" : "#9ca3af"}
        />
        <Text style={[styles.infoText, { color: light ? "#444" : "#d1d5db" }]}>
          Next Stop: {item.nextStop}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="time-outline"
          size={16}
          color={light ? "#555" : "#9ca3af"}
        />
        <Text style={[styles.infoText, { color: light ? "#444" : "#d1d5db" }]}>
          ETA: {item.eta}
        </Text>
      </View>

      <Text style={[styles.info, { color: light ? "#6B7280" : "#9ca3af" }]}>
        Start: {item.startTiming} | Exit: {item.exitTiming}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: light ? "#f9fafb" : "#111827" },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={28} color={light ? "#111827" : "#F9FAFB"} />
    </TouchableOpacity>
        <Text style={[styles.title, { color: light ? "#111" : "#f9fafb" }]}>
          Campus Bus List
        </Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons
            name="options-outline"
            size={28}
            color={light ? "#111" : "#f9fafb"}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: light ? "#fff" : "#374151" },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={light ? "#555" : "#d1d5db"}
        />
        <TextInput
          placeholder="Search by bus number or route..."
          placeholderTextColor={light ? "#888" : "#9ca3af"}
          style={[styles.searchInput, { color: light ? "#111" : "#f9fafb" }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.filterTabs}>
        {["All", "Running", "Ready", "Inactive"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              { backgroundColor: light ? "#e5e7eb" : "#4b5563" },
              statusFilter === tab && {
                backgroundColor:
                  tab === "Running"
                    ? "#22c55e"
                    :( tab === "Ready" ? "#fbbf24":( tab === "Inactive"? "#f87171":"#30bcf8ff")),
              },
            ]}
            onPress={() => setStatusFilter(tab)}
          >
            <Text
              style={[
                styles.filterText,
                { color: light ? "#111" : "#f9fafb" },
                statusFilter === tab && { color: "#fff" },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bus List */}
      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={light ? "#111" : "#f9fafb"}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: light ? "#888" : "#9ca3af" }]}>
            No buses found 🚍
          </Text>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: light ? "#fff" : "#1f2937" }]}>
            <Text style={[styles.modalTitle, { color: light ? "#111" : "#f9fafb" }]}>
              Filters & Sorting
            </Text>

            <Text style={[styles.modalLabel, { color: light ? "#111" : "#f9fafb" }]}>Filter by Route:</Text>
            {["All", "Hostel", "Library", "Main Gate", "Canteen"].map((r) => (
              <Pressable key={r} onPress={() => setRouteFilter(r)}>
                <Text
                  style={[
                    styles.option,
                    { color: light ? "#111" : "#f9fafb" },
                    routeFilter === r && { color: "#30bcf8ff", fontWeight: "700" },
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            ))}

            <Text style={[styles.modalLabel, { marginTop: 10, color: light ? "#111" : "#f9fafb" }]}>
              Sort by:
            </Text>
            {["Bus No (Ascending)", "Bus No (Descending)", "ETA (Soonest)"].map((opt) => (
              <Pressable key={opt} onPress={() => setSortOption(opt)}>
                <Text
                  style={[
                    styles.option,
                    { color: light ? "#111" : "#f9fafb" },
                    sortOption === opt && { color: "#30bcf8ff", fontWeight: "700" },
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: "#30bcf8ff" }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BusListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  searchContainer: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10, elevation: 1 },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 15 },
  filterTabs: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  filterTab: { flex: 1, paddingVertical: 8, marginHorizontal: 3, borderRadius: 8, alignItems: "center" },
  filterText: { fontWeight: "500" },
  card: { borderRadius: 14, padding: 16, marginVertical: 6, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  busNo: { fontSize: 16, fontWeight: "600" },
  statusBadge: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, minWidth: 70, justifyContent: "center" },
  statusText: { color: "#fff", fontWeight: "600", fontSize: 12, marginLeft: 4 },
  route: { marginVertical: 6 },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  infoText: { marginLeft: 6 },
  info: { fontSize: 13, marginBottom: 4, marginTop: 10 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalLabel: { fontSize: 15, fontWeight: "600", marginTop: 6 },
  option: { fontSize: 15, marginVertical: 4, paddingVertical: 4 },
  closeBtn: { borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 16 },
  closeText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  backBtn: {position:"absolute",top:35, marginTop: 20 ,marginLeft:20},
 
  
  
});
