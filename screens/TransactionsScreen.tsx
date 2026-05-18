import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from '../components/TransactionItem';
import { Transaction, TransactionType } from '../types';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;
type Filter = 'all' | TransactionType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Всі' },
  { key: 'income', label: 'Доходи' },
  { key: 'expense', label: 'Витрати' },
];

export default function TransactionsScreen() {
  const nav = useNavigation<Nav>();
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<Filter>('all');

  const data = transactions.filter((t) => filter === 'all' || t.type === filter);

  return (
    <View style={styles.root}>
      {/* Filter tabs */}
      <View style={styles.filterWrap}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterTxt, filter === f.key && styles.filterTxtActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🗂️</Text>
          <Text style={styles.emptyText}>Немає транзакцій</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: Transaction) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => nav.navigate('AddTransaction')}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6FA' },
  filterWrap: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  filterBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9 },
  filterBtnActive: { backgroundColor: '#6C63FF' },
  filterTxt: { fontSize: 14, color: '#666', fontWeight: '500' },
  filterTxtActive: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#aaa', marginTop: 12 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
