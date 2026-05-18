import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Transaction } from '../types';
import { getCategoryById } from '../constants/categories';
import { useFinance } from '../context/FinanceContext';

interface Props {
  transaction: Transaction;
}

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(amount);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export default function TransactionItem({ transaction }: Props) {
  const { deleteTransaction } = useFinance();
  const cat = getCategoryById(transaction.category);

  const handleLongPress = () => {
    Alert.alert('Видалити', 'Видалити цю транзакцію?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => deleteTransaction(transaction.id) },
    ]);
  };

  return (
    <TouchableOpacity style={styles.container} onLongPress={handleLongPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: (cat?.color ?? '#ccc') + '25' }]}>
        <Text style={styles.emoji}>{cat?.icon ?? '💳'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.catName}>{cat?.name ?? transaction.category}</Text>
        {transaction.description ? (
          <Text style={styles.desc} numberOfLines={1}>{transaction.description}</Text>
        ) : null}
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      <Text style={[styles.amount, { color: transaction.type === 'income' ? '#22c55e' : '#ef4444' }]}>
        {transaction.type === 'income' ? '+' : '−'}{formatAmount(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 22 },
  info: { flex: 1 },
  catName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  desc: { fontSize: 13, color: '#666', marginTop: 2 },
  date: { fontSize: 12, color: '#aaa', marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700' },
});
