import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { HomeScreenProps } from '../navigation/types';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const featuredRecipe = {
    id: 'rec_1',
    name: 'Truffle Mushroom Tagliatelle',
    category: 'Italian',
    prepTime: '25 min',
    cookTime: '15 min',
    difficulty: 'Medium',
    calories: '580 kcal',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80',
    description: 'Silky, hand-rolled tagliatelle tossed in a rich black truffle and forest mushroom cream sauce.',
    chefNote: 'Reserve pasta cooking water to emulsify sauce.',
    ingredients: ['Tagliatelle', 'Wild Mushrooms', 'Truffle Cream', 'Heavy Cream', 'Garlic', 'Parmigiano'],
    instructions: ['Boil pasta', 'Sauté mushrooms', 'Add cream & truffle', 'Toss pasta with sauce'],
    nutrition: { protein: '18g', carbs: '68g', fat: '24g', fiber: '4g' }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroBanner}>
        <Text style={styles.greeting}>Welcome, Gourmet Chef 👋</Text>
        <Text style={styles.subtext}>What would you like to cook today?</Text>
      </View>

      {/* Featured Recipe Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe of the Day 🌟</Text>
        <TouchableOpacity 
          style={styles.featuredCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Details', {
            recipeId: featuredRecipe.id,
            recipeName: featuredRecipe.name,
            recipe: featuredRecipe,
            sourceScreen: 'Home'
          })}
        >
          <Image source={{ uri: featuredRecipe.image }} style={styles.featuredImage} />
          <View style={styles.featuredOverlay}>
            <Text style={styles.badge}>{featuredRecipe.category}</Text>
            <Text style={styles.recipeTitle}>{featuredRecipe.name}</Text>
            <Text style={styles.metaText}>⏱ {featuredRecipe.prepTime} • 🔥 {featuredRecipe.calories}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Catalog Entry Button */}
      <TouchableOpacity 
        style={styles.catalogButton}
        onPress={() => navigation.navigate('Catalog', { selectedCategory: 'All' })}
      >
        <Text style={styles.catalogButtonText}>Explore Full Recipe Catalog →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  heroBanner: { padding: 20, backgroundColor: '#1E293B' },
  greeting: { color: '#F8FAFC', fontSize: 22, fontWeight: 'bold' },
  subtext: { color: '#94A3B8', fontSize: 14, marginTop: 4 },
  section: { padding: 20 },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  featuredCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#1E293B', height: 220 },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(15,23,42,0.85)' },
  badge: { backgroundColor: '#E05A47', color: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', fontSize: 12, fontWeight: 'bold' },
  recipeTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 6 },
  metaText: { color: '#CBD5E1', fontSize: 13, marginTop: 4 },
  catalogButton: { margin: 20, backgroundColor: '#E05A47', padding: 16, borderRadius: 12, alignItems: 'center' },
  catalogButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});