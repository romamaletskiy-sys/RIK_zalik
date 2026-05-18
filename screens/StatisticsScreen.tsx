import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../constants/categories';

const W = Dimensions.get('window').width;

const fmt = (n: number) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(n);

export default function StatisticsScreen() {
  const { transactions } = useFinance();

  const expenses = transactions.filter((t) => t.type === 'expense');

  const totals = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});

  const total = Object.values(totals).reduce((a, b) => a + b, 0);

  const chartData = EXPENSE_CATEGORIES.filter((c) => (totals[c.id] ?? 0) > 0).map((c) => ({
    name: c.name,
    amount: totals[c.id],
    color: c.color,
    legendFontColor: '#555',
    legendFontSize: 12,
  }));

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const savings = income - total;

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#ecfdf5' }]}>
          <Text style={styles.summaryLabel}>Доходи</Text>
          <Text style={[styles.summaryVal, { color: '#16a34a' }]}>{fmt(income)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fef2f2' }]}>
          <Text style={styles.summaryLabel}>Витрати</Text>
          <Text style={[styles.summaryVal, { color: '#dc2626' }]}>{fmt(total)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: savings >= 0 ? '#eff6ff' : '#fff7ed' }]}>
          <Text style={styles.summaryLabel}>Залишок</Text>
          <Text style={[styles.summaryVal, { color: savings >= 0 ? '#2563eb' : '#ea580c' }]}>
            {fmt(savings)}
          </Text>
        </View>
      </View>

      {/* Pie chart */}
      {chartData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Немає даних</Text>
          <Text style={styles.emptySub}>Додайте витрати, щоб побачити статистику</Text>
        </View>
      ) : (
        <>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Витрати за категоріями</Text>
            <PieChart
              data={chartData}
              width={W - 32}
              height={200}
              chartConfig={{ color: () => '#6C63FF' }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              hasLegend={false}
            />
            {/* Total label */}
            <Text style={styles.totalLabel}>Разом: {fmt(total)}</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Деталі</Text>
            {[...chartData].sort((a, b) => b.amount - a.amount).map((item, i) => (
              <View key={i} style={[styles.legendRow, i < chartData.length - 1 && styles.legendBorder]}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.legendName}>{item.name}</Text>
                <View style={styles.legendRight}>
                  <Text style={styles.legendAmt}>{fmt(item.amount)}</Text>
                  <Text style={styles.legendPct}>{((item.amount / total) * 100).toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6FA' },
  summaryRow: { flexDirection: 'row', marginHorizontal: 12, marginTop: 16, gap: 8 },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 11, color: '#666', fontWeight: '600' },
  summaryVal: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  totalLabel: { fontSize: 13, color: '#888', marginTop: 4 },
  legendCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  legendTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  legendBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendName: { flex: 1, fontSize: 14, color: '#333' },
  legendRight: { alignItems: 'flex-end' },
  legendAmt: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  legendPct: { fontSize: 12, color: '#999' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#444', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#aaa', marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});
