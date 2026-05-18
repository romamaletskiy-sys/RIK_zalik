import { Category } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Їжа', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { id: 'transport', name: 'Транспорт', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: 'entertainment', name: 'Розваги', icon: '🎭', color: '#45B7D1', type: 'expense' },
  { id: 'shopping', name: 'Покупки', icon: '🛍️', color: '#96CEB4', type: 'expense' },
  { id: 'health', name: "Здоров'я", icon: '💊', color: '#FFB347', type: 'expense' },
  { id: 'education', name: 'Освіта', icon: '📚', color: '#DDA0DD', type: 'expense' },
  { id: 'housing', name: 'Житло', icon: '🏠', color: '#98D8C8', type: 'expense' },
  { id: 'other_expense', name: 'Інше', icon: '💸', color: '#BDC3C7', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Зарплата', icon: '💼', color: '#2ECC71', type: 'income' },
  { id: 'freelance', name: 'Фріланс', icon: '💻', color: '#3498DB', type: 'income' },
  { id: 'gift', name: 'Подарунок', icon: '🎁', color: '#E74C3C', type: 'income' },
  { id: 'other_income', name: 'Інші доходи', icon: '💰', color: '#9B59B6', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryById = (id: string): Category | undefined =>
  ALL_CATEGORIES.find((c) => c.id === id);
