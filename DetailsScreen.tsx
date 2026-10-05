import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { DetailsScreenProps } from '../navigation/types';

export default function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  // Extract route parameters safely passed via navigation.navigate()
  const { recipe, sourceScreen } = route.params;
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Route Params Debug Ribbon */}
      <View style={styles.paramRibbon}>
        <Text style={styles.paramText}>
          📍 Navigated from: <Text style={styles.highlight}>{sourceScreen}</Text>
        </Text>
      </View>

      <Image source={{ uri: recipe.image }} style={styles.heroImage} />

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.category}>{recipe.category} Cuisine</Text>
        
        <Text style={styles.description}>{recipe.description}</Text>

        <Text style={styles.sectionHeader}>Ingredients ({recipe.ingredients.length})</Text>
        {recipe.ingredients.map((item, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.checkRow}
            onPress={() => toggleIngredient(idx)}
          >
            <Text style={checkedIngredients[idx] ? styles.checkDone : styles.checkPending}>
              {checkedIngredients[idx] ? '☑' : '☐'} {item}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Custom Manual Back Button using navigation.goBack() */}
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>← Return to Previous Screen (goBack)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  paramRibbon: { backgroundColor: '#1E293B', padding: 10, borderBottomWidth: 1, borderBottomColor: '#334155' },
  paramText: { color: '#94A3B8', fontSize: 12, textAlign: 'center' },
  highlight: { color: '#E05A47', fontWeight: 'bold' },
  heroImage: { width: '100%', height: 240 },
  content: { padding: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  category: { color: '#E05A47', fontSize: 14, fontWeight: '600', marginTop: 4 },
  description: { color: '#CBD5E1', fontSize: 14, marginVertical: 12, lineHeight: 20 },
  sectionHeader: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  checkRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  checkPending: { color: '#E2E8F0', fontSize: 14 },
  checkDone: { color: '#64748B', textDecorationLine: 'line-through', fontSize: 14 },
  goBackButton: { marginTop: 24, backgroundColor: '#334155', padding: 14, borderRadius: 10, alignItems: 'center' },
  goBackText: { color: '#F8FAFC', fontWeight: 'bold' }
});