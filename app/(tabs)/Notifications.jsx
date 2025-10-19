import { Bell } from "lucide-react-native";
import { useState, useContext } from "react";
import { FlatList, StyleSheet,ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemeContext } from "../../context/ThemeContext"; // adjust path


export default function NotificationsScreen() {
 const router = useRouter();
 const { light } = useContext(ThemeContext);


 const [activeTab, setActiveTab] = useState("All");


 const notifications = [
    { id: "1", title: "Bus 12 is arriving soon", type: "Arrivals", time: "2 mins ago", read: false },
   { id: "2", title: "Bus 5 delayed by 10 minutes", type: "Delays", time: "10 mins ago", read: true },
 ];


 const filtered =
   activeTab === "All"
   ? notifications
   : activeTab === "Unread"
   ? notifications.filter((n) => !n.read)
   : notifications.filter((n) => n.type === activeTab);


 const themeStyles = StyleSheet.create({
   container: { flex: 1, backgroundColor: light ? "#F9FAFB" : "#1F2937", padding: 20 },
   title: { fontSize: 26,marginTop: 30,marginBottom:10, paddingLeft:50, fontWeight: "bold", color: light ? "#111827" : "#F9FAFB" },
   subtitle: { fontSize: 14, color: light ? "#6B7280" : "#D1D5DB", marginBottom: 25 },
   tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20,gap:10 },
   tabButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: light ? "#E5E7EB" : "#374151",marginRight:10 },
   activeTab: { backgroundColor: "#30bcf8ff" },
   tabText: { color: light ? "#374151" : "#F9FAFB", fontWeight: "500" },
   activeTabText: { color: "#fff" },
   card: { backgroundColor: light ? "#fff" : "#374151", padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
   cardTitle: { fontSize: 16, fontWeight: "600", color: light ? "#111827" : "#F9FAFB" },
   cardTime: { fontSize: 12, color: light ? "#6B7280" : "#D1D5DB", marginTop: 4 },
   emptyContainer: { alignItems: "center", marginTop: 60 },
   emptyText: { fontSize: 16, fontWeight: "600", color: light ? "#374151" : "#F9FAFB", marginTop: 10 },
   emptySubText: { fontSize: 13, color: light ? "#9CA3AF" : "#D1D5DB" },
   backBtn: {position:"absolute",top:35, marginTop: 20 ,marginLeft:20},
 });


 return (
   <View style={themeStyles.container}>
   {/* Back Button */}
   
 
   <Text style={themeStyles.title}>Notifications</Text>
   <TouchableOpacity style={themeStyles.backBtn} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={28} color={light ? "#111827" : "#F9FAFB"} />
    </TouchableOpacity>

  
   <Text style={themeStyles.subtitle}>Stay updated with bus alerts and announcements</Text>


<View   style={themeStyles.tabs}>
      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 10, alignItems: "center" }}
>
  {["All", "Arrivals", "Delays", "Route Changes",].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[themeStyles.tabButton, activeTab === tab && themeStyles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[themeStyles.tabText, activeTab === tab && themeStyles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
</ScrollView>
        
      </View> 


      {/* Notifications */}
      {filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={themeStyles.card}>
              <Text style={themeStyles.cardTitle}>{item.title}</Text>
              <Text style={themeStyles.cardTime}>{item.time}</Text>
            </View>
          )}
        />
      ) : (
        <View style={themeStyles.emptyContainer}>
          <Bell size={48} color={light ? "#9CA3AF" : "#D1D5DB"} />
          <Text style={themeStyles.emptyText}>No notifications found</Text>
          <Text style={themeStyles.emptySubText}>You’ll see bus updates and alerts here</Text>
        </View>
      )}
    </View>
  );
} 