import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";

type Item = { id: string; name: string; price: number; image: string; category: string };
type CartItem = { id: string; name: string; price: number; qty: number };

const CATEGORIES = ["All", "Fast Food", "Main Course", "Pasta", "Drinks"];

const INITIAL_ITEMS: Item[] = [
  { id: "1", name: "Beef Burger", price: 149, image: "https://picsum.photos/300/300?1", category: "Fast Food" },
  { id: "2", name: "Fish & Chips", price: 149, image: "https://picsum.photos/300/300?2", category: "Fast Food" },
  { id: "3", name: "Ribeye Steak", price: 249, image: "https://picsum.photos/300/300?3", category: "Main Course" },
  { id: "4", name: "Aglio Olio", price: 149, image: "https://picsum.photos/300/300?4", category: "Pasta" },
  { id: "5", name: "Chicken Chop", price: 149, image: "https://picsum.photos/300/300?5", category: "Main Course" },
  { id: "6", name: "Lamb Shank", price: 249, image: "https://picsum.photos/300/300?6", category: "Main Course" },
  { id: "7", name: "Vanilla Latte", price: 69, image: "https://picsum.photos/300/300?7", category: "Drinks" },
  { id: "8", name: "Cold Coffee", price: 79, image: "https://picsum.photos/300/300?8", category: "Drinks" },
];

export default function TabOneScreen() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCat, setSelectedCat] = useState("All");

  // Theme
  const [dark, setDark] = useState(true);

  const BG = dark ? "#0F172A" : "#F8FAFC";
  const CARD = dark ? "#020617" : "#FFFFFF";
  const TEXT = dark ? "#FFFFFF" : "#020617";
  const MUTED = dark ? "#CBD5E1" : "#64748B";
  const BORDER = dark ? "#1E293B" : "#E5E7EB";
  const ACCENT = dark ? "#22C55E" : "#F97316";
  const DANGER = "#EF4444";

  // Modals
  const [showMore, setShowMore] = useState(false);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showEditList, setShowEditList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState("Fast Food");

  // Cart logic
  const addToCart = (item: Item) => {
    setCart((prev) => {
      const f = prev.find((p) => p.id === item.id);
      if (f) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const inc = (id: string) => setCart((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (id: string) =>
    setCart((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x)).filter((x) => x.qty > 0));
  const removeCartItem = (id: string) => setCart((p) => p.filter((x) => x.id !== id));
  const clearCart = () => setCart([]);

  const subTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = +(subTotal * 0.05).toFixed(2);
  const total = +(subTotal + gst).toFixed(2);

  // Add / Edit
  const openAdd = () => {
    setEditingItem(null);
    setFormName("");
    setFormPrice("");
    setFormImage("");
    setFormCategory("Fast Food");
    setShowAddEdit(true);
  };

  const openEditItem = (item: Item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(String(item.price));
    setFormImage(item.image);
    setFormCategory(item.category);
    setShowAddEdit(true);
  };

  const saveItem = () => {
    if (!formName || !formPrice) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, name: formName, price: Number(formPrice), image: formImage || i.image, category: formCategory }
            : i
        )
      );
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        name: formName,
        price: Number(formPrice),
        image: formImage || "https://picsum.photos/300/300?random=" + Math.random(),
        category: formCategory,
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setShowAddEdit(false);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredItems =
    selectedCat === "All" ? items : items.filter((i) => i.category === selectedCat);

  const renderItem = ({ item }: { item: Item }) => (
    <Pressable style={[styles.card, { backgroundColor: CARD, borderColor: BORDER }]} onPress={() => addToCart(item)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: TEXT }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.cardPrice, { color: ACCENT }]}>₹ {item.price}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: BG }]}>
      <View style={[styles.header, { borderBottomColor: BORDER, backgroundColor: CARD }]}>
        <Text style={[styles.headerTitle, { color: ACCENT }]}>RESTAURANT</Text>
        <View style={{ flexDirection: "row" }}>
          <Pressable style={[styles.iconBtn, { borderColor: BORDER }]} onPress={() => setShowMore(true)}>
            <Text style={{ color: TEXT, fontWeight: "900" }}>⋮</Text>
          </Pressable>
          <Pressable style={[styles.iconBtn, { borderColor: BORDER }]} onPress={() => setShowSettings(true)}>
            <Text style={{ color: TEXT, fontWeight: "900" }}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 8, paddingHorizontal: 8 }}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setSelectedCat(c)}
            style={{
              marginRight: 8,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: selectedCat === c ? ACCENT : CARD,
              borderWidth: 1,
              borderColor: BORDER,
            }}
          >
            <Text style={{ color: selectedCat === c ? "#fff" : TEXT, fontWeight: "800", fontSize: 12 }}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.body}>
        {/* Left: Items */}
        <View style={styles.left}>
          <FlatList
            data={filteredItems}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{ padding: 8 }}
            columnWrapperStyle={{ gap: 8 }}
          />
        </View>

        {/* Right: Cart */}
        <View style={[styles.right, { backgroundColor: CARD, borderLeftColor: BORDER }]}>
          <View style={styles.cartHeader}>
            <Text style={[styles.cartTitle, { color: TEXT }]}>ITEMS</Text>
            <Pressable style={styles.clearBtn} onPress={clearCart}>
              <Text style={{ color: "#fff", fontWeight: "900" }}>CLEAR</Text>
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1 }}>
            {cart.map((c) => (
              <View key={c.id} style={[styles.cartItem, { borderBottomColor: BORDER }]}>
                <Text style={{ color: TEXT, fontWeight: "700" }}>{c.name}</Text>
                <Text style={{ color: MUTED }}>₹ {c.price}</Text>

                <View style={styles.cartControlsRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable style={[styles.qBtn, { backgroundColor: "#FEE2E2" }]} onPress={() => dec(c.id)}>
                      <Text style={styles.qText}>−</Text>
                    </Pressable>
                    <View style={styles.qCountBox}>
                      <Text style={[styles.qCount, { color: TEXT }]}>{c.qty}</Text>
                    </View>
                    <Pressable style={[styles.qBtn, { backgroundColor: "#DCFCE7" }]} onPress={() => inc(c.id)}>
                      <Text style={styles.qText}>+</Text>
                    </Pressable>
                  </View>

                  <Pressable onPress={() => removeCartItem(c.id)}>
                    <Text style={{ color: DANGER, fontWeight: "900", fontSize: 16 }}>✕</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.billBox, { borderTopColor: BORDER }]}>
            <View style={styles.billRow}><Text style={{ color: TEXT }}>Subtotal</Text><Text style={{ color: TEXT }}>₹ {subTotal.toFixed(2)}</Text></View>
            <View style={styles.billRow}><Text style={{ color: TEXT }}>GST (5%)</Text><Text style={{ color: TEXT }}>₹ {gst.toFixed(2)}</Text></View>
            <View style={styles.billRow}>
              <Text style={{ fontWeight: "800", color: TEXT }}>Total</Text>
              <Text style={{ color: ACCENT, fontWeight: "900" }}>₹ {total.toFixed(2)}</Text>
            </View>
          </View>

          <Pressable style={[styles.chargeBtn, { backgroundColor: ACCENT }]}>
            <Text style={styles.chargeText}>CHARGE</Text>
          </Pressable>
        </View>
      </View>

      {/* MORE MENU */}
      <Modal visible={showMore} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.menuBox, { backgroundColor: CARD }]}>
            <Pressable style={[styles.menuBtn, { borderColor: BORDER }]} onPress={() => { setShowMore(false); openAdd(); }}>
              <Text style={{ color: TEXT, fontWeight: "800" }}>Add Food</Text>
            </Pressable>
            <Pressable style={[styles.menuBtn, { borderColor: BORDER }]} onPress={() => { setShowMore(false); setShowEditList(true); }}>
              <Text style={{ color: TEXT, fontWeight: "800" }}>Edit Items</Text>
            </Pressable>
            <Pressable style={[styles.menuBtn, { backgroundColor: DANGER }]} onPress={() => setShowMore(false)}>
              <Text style={{ color: "#fff", fontWeight: "900" }}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ADD / EDIT */}
      <Modal visible={showAddEdit} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: CARD }]}>
            <Text style={[styles.modalTitle, { color: TEXT }]}>{editingItem ? "Edit Item" : "Add Item"}</Text>
            <TextInput placeholder="Food Name" value={formName} onChangeText={setFormName} style={[styles.input, { color: TEXT, borderColor: BORDER }]} placeholderTextColor={MUTED} />
            <TextInput placeholder="Price" value={formPrice} onChangeText={setFormPrice} keyboardType="numeric" style={[styles.input, { color: TEXT, borderColor: BORDER }]} placeholderTextColor={MUTED} />
            <TextInput placeholder="Image URL" value={formImage} onChangeText={setFormImage} style={[styles.input, { color: TEXT, borderColor: BORDER }]} placeholderTextColor={MUTED} />

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {CATEGORIES.filter(c => c !== "All").map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setFormCategory(c)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: BORDER,
                    backgroundColor: formCategory === c ? ACCENT : "transparent",
                  }}
                >
                  <Text style={{ color: formCategory === c ? "#fff" : TEXT, fontWeight: "800" }}>{c}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable style={[styles.saveBtn, { backgroundColor: ACCENT }]} onPress={saveItem}>
                <Text style={{ color: "#fff", fontWeight: "900" }}>SAVE</Text>
              </Pressable>
              <Pressable style={[styles.saveBtn, { backgroundColor: DANGER }]} onPress={() => setShowAddEdit(false)}>
                <Text style={{ color: "#fff", fontWeight: "900" }}>CLOSE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT LIST */}
      <Modal visible={showEditList} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: CARD }]}>
            <Text style={[styles.modalTitle, { color: TEXT }]}>Edit Items</Text>
            <ScrollView>
              {items.map((i) => (
                <View key={i.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ color: TEXT }}>{i.name}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={() => openEditItem(i)} style={{ marginRight: 10 }}>
                      <Text style={{ color: ACCENT, fontWeight: "800" }}>EDIT</Text>
                    </Pressable>
                    <Pressable onPress={() => deleteItem(i.id)}>
                      <Text style={{ color: DANGER, fontWeight: "800" }}>DEL</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Pressable style={[styles.saveBtn, { backgroundColor: DANGER, marginTop: 10 }]} onPress={() => setShowEditList(false)}>
              <Text style={{ color: "#fff", fontWeight: "900" }}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* SETTINGS */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={[styles.modalBox, { backgroundColor: CARD }]}>
            <Text style={[styles.modalTitle, { color: TEXT }]}>Settings</Text>
            <Pressable style={[styles.menuBtn, { borderColor: BORDER }]} onPress={() => setDark(false)}>
              <Text style={{ color: TEXT, fontWeight: "800" }}>Light Theme</Text>
            </Pressable>
            <Pressable style={[styles.menuBtn, { borderColor: BORDER }]} onPress={() => setDark(true)}>
              <Text style={{ color: TEXT, fontWeight: "800" }}>Dark Theme</Text>
            </Pressable>
            <Pressable style={[styles.saveBtn, { backgroundColor: DANGER, marginTop: 10 }]} onPress={() => setShowSettings(false)}>
              <Text style={{ color: "#fff", fontWeight: "900" }}>CLOSE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { height: 44, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1 },
  headerTitle: { fontSize: 14, fontWeight: "900" },
  iconBtn: { marginLeft: 8, padding: 6, borderRadius: 8, borderWidth: 1 },

  body: { flex: 1, flexDirection: "row" },
  left: { flex: 2 },
  right: { flex: 1, padding: 8, borderLeftWidth: 1 },

  card: { borderRadius: 12, borderWidth: 1, overflow: "hidden", marginBottom: 8 },
  cardImage: { width: "100%", height: 100 },
  cardBody: { padding: 8 },
  cardTitle: { fontWeight: "700" },
  cardPrice: { fontWeight: "800" },

  cartHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cartTitle: { fontWeight: "800" },
  clearBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#EF4444", borderRadius: 8 },

  cartItem: { borderBottomWidth: 1, marginBottom: 8, paddingBottom: 6 },
  cartControlsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },

  qBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  qText: { fontSize: 16, fontWeight: "900" },
  qCountBox: { minWidth: 28, alignItems: "center" },
  qCount: { fontSize: 14, fontWeight: "900" },

  billBox: { marginTop: 6, borderTopWidth: 1, paddingTop: 6 },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },

  chargeBtn: { marginTop: 8, padding: 10, borderRadius: 10, alignItems: "center" },
  chargeText: { color: "#fff", fontWeight: "900" },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", padding: 16, borderRadius: 12 },
  modalTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },
  saveBtn: { padding: 10, borderRadius: 8, alignItems: "center" },

  menuBox: { width: 240, padding: 12, borderRadius: 12 },
  menuBtn: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8, alignItems: "center" },
});
