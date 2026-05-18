import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from '../components/TransactionItem';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const fmt = (n: number) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(n);

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { transactions, totalBalance, totalIncome, totalExpenses, isLoading } = useFinance();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const recent = transactions.slice(0, 5);

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* ── Balance card ── */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Загальний баланс</Text>
        <Text style={[styles.cardBalance, { color: totalBalance < 0 ? '#fca5a5' : '#fff' }]}>
          {fmt(totalBalance)}
        </Text>
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>↓</Text>
            <Text style={styles.statLabel}>Доходи</Text>
            <Text style={styles.statVal}>{fmt(totalIncome)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statIcon}>↑</Text>
            <Text style={styles.statLabel}>Витрати</Text>
            <Text style={styles.statVal}>{fmt(totalExpenses)}</Text>
          </View>
        </View>
      </View>

      {/* ── Add button ── */}
      <TouchableOpacity style={styles.addBtn} onPress={() => nav.navigate('AddTransaction')}>
        <Text style={styles.addBtnText}>＋  Додати транзакцію</Text>
      </TouchableOpacity>

      {/* ── Recent ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Останні операції</Text>
        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💳</Text>
            <Text style={styles.emptyText}>Ще немає транзакцій</Text>
            <Text style={styles.emptySub}>Натисніть кнопку вище, щоб додати першу</Text>
          </View>
        ) : (
          recent.map((t) => <TransactionItem key={t.id} transaction={t} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6FA' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#6C63FF',
    margin: 16,
    borderRadius: 22,
    padding: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  cardLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  cardBalance: { fontSize: 38, fontWeight: '800', color: '#fff', marginVertical: 8 },
  row: { flexDirection: 'row', marginTop: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statIcon: { fontSize: 18, color: '#fff', fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  statVal: { color: '#fff', fontSize: 15, fontWeight: '600', marginTop: 2 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  addBtn: {
    backgroundColor: '#6C63FF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  section: { margin: 16, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 36, backgroundColor: '#fff', borderRadius: 16 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 16, color: '#555', fontWeight: '600', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#aaa', marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
});
