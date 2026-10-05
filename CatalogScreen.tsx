import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { CatalogScreenProps, RecipeItem } from '../navigation/types';

export default function CatalogScreen({ route, navigation }: CatalogScreenProps) {
  const initialCategory = route.params?.selectedCategory || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  return (
    <View style={styles.container}>
      {/* Header bar back button option */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Catalog</Text>
      </View>

      <Text style={styles.header}>Find your favorite dish</Text>

      {/* Render Filterable Recipe Item */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // Navigation passing parameters object
          navigation.navigate('Details', {
            recipeId: 'rec_1',
            recipeName: 'Truffle Mushroom Tagliatelle',
            recipe: { /* full recipe object */ } as RecipeItem,
            sourceScreen: 'Catalog'
          });
        }}
      >
        <Text style={styles.cardTitle}>Truffle Mushroom Tagliatelle</Text>
        <Text style={styles.cardMeta}>Tap to view route.params data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  topNav: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 8, backgroundColor: '#334155', borderRadius: 8 },
  backBtnText: { color: '#E05A47', fontWeight: 'bold' },
  navTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 16 },
  header: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#E05A47' },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardMeta: { color: '#94A3B8', fontSize: 13, marginTop: 4 }
});