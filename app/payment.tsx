import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>Cash</Text>
      </Pressable>

      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>UPI / QR</Text>
      </Pressable>

      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>Card</Text>
      </Pressable>

      <Pressable style={[styles.btn, { backgroundColor: "#ddd" }]} onPress={() => router.back()}>
        <Text style={[styles.btnText, { color: "#000" }]}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 20 },
  btn: {
    width: "70%",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#F97316",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
