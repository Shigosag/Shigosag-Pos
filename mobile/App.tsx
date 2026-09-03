import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { ShoppingCart, ShieldCheck } from 'lucide-react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <ShoppingCart color="#4338ca" size={32} />
        </View>
        <Text style={styles.title}>Shigosag POS</Text>
        <Text style={styles.subtitle}>Mobile Terminal</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦10,000,000.00</Text>
          <View style={styles.badge}>
            <ShieldCheck color="#fff" size={12} />
            <Text style={styles.badgeText}>SECURE SESSION</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => console.log('Init Checkout')}
        >
          <Text style={styles.buttonText}>Launch POS Terminal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoContainer: { backgroundColor: '#e0e7ff', padding: 15, borderRadius: 20, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  main: { paddingHorizontal: 25 },
  balanceCard: { backgroundColor: '#4338ca', borderRadius: 30, padding: 30, marginBottom: 30, elevation: 10 },
  balanceLabel: { color: '#c7d2fe', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  balanceValue: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 5 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginTop: 20 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', marginLeft: 5 },
  primaryButton: { backgroundColor: '#0f172a', height: 70, borderRadius: 20, alignItems: 'center', justifyCenter: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '900' }
});
