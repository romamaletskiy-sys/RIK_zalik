import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { TransactionType } from '../types';

export default function AddTransactionScreen() {
  const nav = useNavigation();
  const { addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory('');
  };

  const handleSave = async () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Помилка', 'Введіть коректну суму');
      return;
    }
    if (!category) {
      Alert.alert('Помилка', 'Оберіть категорію');
      return;
    }
    await addTransaction({ type, amount: parsed, category, description, date: new Date().toISOString() });
    nav.goBack();
  };

  const isExpense = type === 'expense';
  const accentColor = isExpense ? '#ef4444' : '#22c55e';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

        {/* Type selector */}
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, isExpense && { backgroundColor: '#ef4444' }]}
            onPress={() => handleTypeChange('expense')}
          >
            <Text style={[styles.typeTxt, isExpense && styles.typeTxtActive]}>↑  Витрата</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, !isExpense && { backgroundColor: '#22c55e' }]}
            onPress={() => handleTypeChange('income')}
          >
            <Text style={[styles.typeTxt, !isExpense && styles.typeTxtActive]}>↓  Дохід</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>СУМА (₴)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currSign}>₴</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#ccc"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>КАТЕГОРІЯ</Text>
          <View style={styles.catGrid}>
            {categories.map((cat) => {
              const active = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catItem,
                    active && { borderColor: cat.color, backgroundColor: cat.color + '18' },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                  <Text style={[styles.catName, active && { color: cat.color, fontWeight: '700' }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>ОПИС (НЕОБОВ'ЯЗКОВО)</Text>
          <TextInput
            style={styles.descInput}
            placeholder="Наприклад: Обід у кафе"
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Save button */}
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: accentColor }]} onPress={handleSave}>
          <Text style={styles.saveTxt}>{isExpense ? 'Додати витрату' : 'Додати дохід'}</Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6FA' },
  typeRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 11,
    alignItems: 'center',
  },
  typeTxt: { fontSize: 15, fontWeight: '600', color: '#666' },
  typeTxtActive: { color: '#fff' },
  section: { marginHorizontal: 16, marginBottom: 20 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  currSign: { fontSize: 30, color: '#bbb', marginRight: 8 },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a2e',
    paddingVertical: 14,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catItem: {
    width: '22%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  catEmoji: { fontSize: 24, marginBottom: 4 },
  catName: { fontSize: 10, color: '#666', textAlign: 'center' },
  descInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: '#1a1a2e',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtn: {
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveTxt: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
