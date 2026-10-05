import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Heart,
  Clock,
  Flame,
  ChefHat,
  BookOpen,
  Sparkles,
  Code,
  Smartphone,
  Info,
  CheckCircle2,
  Filter,
  Share2,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Layers,
  Terminal,
  Utensils,
  Star,
  SlidersHorizontal,
  X,
  ExternalLink,
  BookMarked,
  ArrowLeft
} from 'lucide-react';

const RECIPES = [
  {
    id: 'rec_1',
    name: 'Truffle Mushroom Tagliatelle',
    category: 'Italian',
    prepTime: '25 min',
    cookTime: '15 min',
    difficulty: 'Medium',
    calories: '580 kcal',
    rating: 4.9,
    reviews: 128,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80',
    description: 'Silky, hand-rolled tagliatelle tossed in a rich black truffle and forest mushroom cream sauce, finished with aged Parmigiano-Reggiano.',
    chefNote: 'Reserve 1/2 cup of starchy pasta cooking water to emulsify the truffle sauce to velvet perfection.',
    ingredients: [
      '350g Fresh Tagliatelle Pasta',
      '200g Mixed Wild Mushrooms (Cremini, Shiitake)',
      '3 tbsp Black Truffle Cream / Paste',
      '1/2 cup Heavy Cream',
      '3 cloves Garlic, thinly sliced',
      '1/2 cup Aged Parmigiano-Reggiano',
      '2 tbsp Fresh Parsley, chopped',
      'Sea Salt & Freshly Ground Black Pepper'
    ],
    instructions: [
      'Bring a large pot of heavily salted water to a rolling boil.',
      'Sauté sliced mushrooms in olive oil over high heat until golden brown (approx 6 mins).',
      'Add garlic and truffle paste; stir for 1 minute until highly aromatic.',
      'Pour in heavy cream, reduce heat to low, and let simmer gently.',
      'Cook tagliatelle for 3 minutes until al dente, then transfer directly into the sauce.',
      'Toss vigorously with grated Parmigiano and pasta water until glossy. Garnish with parsley and serve immediately.'
    ],
    nutrition: { protein: '18g', carbs: '68g', fat: '24g', fiber: '4g' }
  },
  {
    id: 'rec_2',
    name: 'Spicy Salmon Poké Bowl',
    category: 'Asian',
    prepTime: '15 min',
    cookTime: '10 min',
    difficulty: 'Easy',
    calories: '430 kcal',
    rating: 4.8,
    reviews: 94,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh sashimi-grade salmon tossed in spicy sriracha ponzu, served over seasoned sushi rice with avocado, edamame, and pickled ginger.',
    chefNote: 'Ensure the salmon is super chilled before dicing for clean, clean cuts.',
    ingredients: [
      '300g Sashimi-grade Atlantic Salmon',
      '2 cups Cooked Sushi Rice',
      '1 Avocado, sliced',
      '1/2 cup Edamame beans, steamed',
      '1/2 cup Cucumber, ribboned',
      '2 tbsp Spicy Sriracha Mayo',
      '1 tbsp Ponzu Soy Dressing',
      '1 tsp Toasted Sesame Seeds & Nori flakes'
    ],
    instructions: [
      'Dice the salmon into 1/2 inch uniform cubes.',
      'In a bowl, toss salmon cubes gently with ponzu dressing and sriracha mayo.',
      'Divide warm seasoned sushi rice into two serving bowls.',
      'Arrange diced salmon, avocado, edamame, and cucumber ribbons systematically over rice.',
      'Drizzle extra mayo and sprinkle toasted sesame seeds and crushed nori on top.'
    ],
    nutrition: { protein: '32g', carbs: '45g', fat: '16g', fiber: '6g' }
  },
  {
    id: 'rec_3',
    name: 'Avocado Lime Fiesta Tacos',
    category: 'Mexican',
    prepTime: '20 min',
    cookTime: '10 min',
    difficulty: 'Easy',
    calories: '360 kcal',
    rating: 4.7,
    reviews: 82,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    description: 'Warm street corn tortillas loaded with smoky black beans, creamy lime avocado, charred corn salsa, and fresh cilantro cream.',
    chefNote: 'Char your corn tortillas directly over an open gas flame for 10 seconds for authentic smoky taste.',
    ingredients: [
      '6 Warm Corn Tortillas',
      '1 cup Charred Sweet Corn',
      '1 can Black Beans, rinsed & seasoned',
      '2 Ripe Avocados, sliced',
      '1/2 cup Pico de Gallo',
      '1/4 cup Cilantro Lime Crema',
      '1 Lime, cut into wedges',
      'Crumbled Cotija or Feta Cheese'
    ],
    instructions: [
      'Warm corn tortillas in a dry skillet until pliable and lightly blistered.',
      'Layer a generous tablespoon of seasoned warm black beans on each tortilla base.',
      'Top with charred corn, avocado slices, and fresh pico de gallo.',
      'Drizzle with cilantro lime crema and sprinkle cotija cheese.',
      'Serve fresh with squeezed lime wedges.'
    ],
    nutrition: { protein: '12g', carbs: '48g', fat: '15g', fiber: '10g' }
  },
  {
    id: 'rec_4',
    name: 'Artisan Berry French Toast',
    category: 'Breakfast',
    prepTime: '10 min',
    cookTime: '10 min',
    difficulty: 'Easy',
    calories: '390 kcal',
    rating: 4.9,
    reviews: 156,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
    description: 'Thick slices of brioche soaked in rich vanilla cinnamon custard, pan-fried to golden perfection and topped with fresh berries and maple syrup.',
    chefNote: 'Day-old brioche absorbs custard better without becoming soggy.',
    ingredients: [
      '4 Thick slices Brioche Bread',
      '2 Large Organic Eggs',
      '1/3 cup Whole Milk or Heavy Cream',
      '1 tsp Pure Vanilla Extract',
      '1/2 tsp Ground Cinnamon',
      '1 cup Mixed Fresh Berries (Strawberries, Blueberries)',
      'Pure Maple Syrup & Powdered Sugar'
    ],
    instructions: [
      'Whisk eggs, milk, vanilla, and cinnamon in a shallow dish.',
      'Dip brioche slices into the custard for 15 seconds per side.',
      'Melt butter in a non-stick skillet over medium-low heat.',
      'Cook slices for 3-4 minutes per side until deep golden brown.',
      'Dust with powdered sugar, top with fresh berries, and drizzle warm maple syrup.'
    ],
    nutrition: { protein: '14g', carbs: '52g', fat: '14g', fiber: '5g' }
  },
  {
    id: 'rec_5',
    name: 'Pan-Seared Herb Ribeye',
    category: 'Gourmet',
    prepTime: '15 min',
    cookTime: '15 min',
    difficulty: 'Hard',
    calories: '710 kcal',
    rating: 5.0,
    reviews: 210,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    description: 'Prime ribeye steak seared in a screaming-hot cast-iron skillet, continuously basted with garlic, fresh rosemary, and European butter.',
    chefNote: 'Let the steak rest for at least 8 minutes before slicing to lock in juicy flavors.',
    ingredients: [
      '1 Prime Bone-In Ribeye Steak (1.5 inch thick)',
      '3 tbsp Unsalted Butter',
      '4 cloves Garlic, smashed',
      '3 sprigs Fresh Rosemary & Thyme',
      '2 tbsp High-heat Cooking Oil',
      'Coarse Sea Salt & Cracked Black Pepper'
    ],
    instructions: [
      'Pat ribeye completely dry with paper towels; season generously with coarse salt & pepper.',
      'Heat cast-iron skillet until smoking hot with cooking oil.',
      'Sear steak for 3 minutes without moving to develop a deep crust.',
      'Flip steak, add butter, garlic, and herb sprigs to the skillet.',
      'Tilt pan and baste steak continuously with melted herb butter for 3 minutes.',
      'Remove steak to a warm cutting board and rest 8 minutes before carving.'
    ],
    nutrition: { protein: '48g', carbs: '2g', fat: '56g', fiber: '0g' }
  },
  {
    id: 'rec_6',
    name: 'Matcha Green Tea Cheesecake',
    category: 'Desserts',
    prepTime: '30 min',
    cookTime: '50 min',
    difficulty: 'Medium',
    calories: '420 kcal',
    rating: 4.8,
    reviews: 67,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    description: 'Creamy Japanese-style baked cheesecake infused with ceremonial grade Uji matcha, set upon a crisp graham cracker crust.',
    chefNote: 'Sift your matcha powder with powdered sugar to avoid clumps in the batter.',
    ingredients: [
      '500g Cream Cheese, room temp',
      '2 tbsp Ceremonial Matcha Powder',
      '3/4 cup Granulated Sugar',
      '3 Eggs, room temp',
      '1/2 cup Heavy Cream',
      '1 cup Graham Cracker Crumbs',
      '3 tbsp Melted Butter'
    ],
    instructions: [
      'Mix graham cracker crumbs with melted butter and press firmly into a springform pan.',
      'Beat cream cheese and sugar until smooth; whisk in sifted matcha powder.',
      'Add eggs one at a time, followed by heavy cream, mixing gently.',
      'Pour batter into crust and bake at 150°C (300°F) in a water bath for 50 minutes.',
      'Cool completely, chill overnight, and dust with matcha before serving.'
    ],
    nutrition: { protein: '8g', carbs: '38g', fat: '26g', fiber: '1g' }
  }
];

const CATEGORIES = [
  { id: 'All', name: 'All Recipes', icon: Utensils, count: 6, color: 'bg-amber-500' },
  { id: 'Italian', name: 'Italian', icon: Sparkles, count: 1, color: 'bg-red-500' },
  { id: 'Asian', name: 'Asian', icon: Flame, count: 1, color: 'bg-emerald-500' },
  { id: 'Mexican', name: 'Mexican', icon: SlidersHorizontal, count: 1, color: 'bg-orange-500' },
  { id: 'Breakfast', name: 'Breakfast', icon: Clock, count: 1, color: 'bg-yellow-500' },
  { id: 'Gourmet', name: 'Gourmet', icon: ChefHat, count: 1, color: 'bg-purple-500' },
  { id: 'Desserts', name: 'Desserts', icon: Star, count: 1, color: 'bg-pink-500' }
];

const CODE_FILES = {
  'App.tsx': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation/types';

import HomeScreen from './screens/HomeScreen';
import CatalogScreen from './screens/CatalogScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Gourmet Bites' }}
        />
        <Stack.Screen 
          name="Catalog" 
          component={CatalogScreen} 
          options={{ title: 'Recipe Catalog' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={({ route }) => ({ 
            title: route.params.recipeName || 'Recipe Details' 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,

  'navigation/types.ts': `import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RecipeItem = {
  id: string;
  name: string;
  category: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  chefNote: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
};

export type RootStackParamList = {
  Home: undefined;
  Catalog: {
    selectedCategory?: string;
    searchQuery?: string;
  } | undefined;
  Details: {
    recipeId: string;
    recipeName: string;
    recipe: RecipeItem;
    sourceScreen: string;
  };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type CatalogScreenProps = NativeStackScreenProps<RootStackParamList, 'Catalog'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;`,

  'screens/HomeScreen.tsx': `import React from 'react';
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
});`,

  'screens/CatalogScreen.tsx': `import React, { useState } from 'react';
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
});`,

  'screens/DetailsScreen.tsx': `import React, { useState } from 'react';
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
});`,

  'package.json': `{
  "name": "gourmet-bites-react-navigation",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "lucide-react-native": "^0.300.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  }
}`
};

export default function App() {
  const [activeTab, setActiveTab] = useState('app'); // 'app' | 'code'
  const [selectedCodeFile, setSelectedCodeFile] = useState('App.tsx');
  const [copiedCode, setCopiedCode] = useState(false);
  const [bookmarks, setBookmarks] = useState(['rec_1', 'rec_4']);
  const [showParamInspector, setShowParamInspector] = useState(true);

  // Simulated React Navigation NavigationContainer & Stack State
  const [navStack, setNavStack] = useState([
    { name: 'Home', params: {}, title: 'Gourmet Bites' }
  ]);

  // Derived current route
  const currentRoute = navStack[navStack.length - 1];

  // Navigation controller object (emulates navigation prop in React Navigation)
  const navigation = useMemo(() => ({
    navigate: (screenName, params = {}) => {
      let title = 'Gourmet Bites';
      if (screenName === 'Catalog') title = 'Recipe Catalog';
      if (screenName === 'Details') title = params.recipeName || 'Recipe Details';

      setNavStack(prev => [...prev, { name: screenName, params, title }]);
    },
    goBack: () => {
      if (navStack.length > 1) {
        setNavStack(prev => prev.slice(0, -1));
      }
    },
    popToTop: () => {
      setNavStack([navStack[0]]);
    },
    canGoBack: () => navStack.length > 1
  }), [navStack]);

  const toggleBookmark = (recipeId) => {
    setBookmarks(prev => 
      prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_FILES[selectedCodeFile]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  
  // SCREEN 1: HomeScreen Component
  const HomeScreen = ({ navigation }) => {
    const featured = RECIPES[0];

    return (
      <div className="p-4 space-y-6 animate-fadeIn">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-amber-600 to-rose-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-20 pointer-events-none">
            <ChefHat className="w-40 h-40" />
          </div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest bg-black/20 px-2.5 py-1 rounded-full border border-white/20">
                Welcome Back
              </span>
              <h2 className="text-2xl font-extrabold mt-2">Master Chef 👋</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-white/30 text-xs font-semibold">
              <BookMarked className="w-3.5 h-3.5" />
              <span>{bookmarks.length} Saved</span>
            </div>
          </div>
          <p className="text-amber-100 text-sm max-w-[240px]">
            Explore gourmet recipes and learn React Navigation stack transitions.
          </p>
        </div>

        {/* Recipe of the Day Spotlight */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Recipe of the Day
            </h3>
            <span className="text-xs text-amber-400 font-medium">Daily Pick</span>
          </div>

          <div 
            onClick={() => navigation.navigate('Details', {
              recipeId: featured.id,
              recipeName: featured.name,
              recipe: featured,
              sourceScreen: 'Home Spotlight'
            })}
            className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-amber-500/50 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <div className="h-44 overflow-hidden relative">
              <img 
                src={featured.image} 
                alt={featured.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button 
                onClick={(e) => { e.stopPropagation(); toggleBookmark(featured.id); }}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 backdrop-blur-md text-white hover:text-amber-400 transition-colors"
              >
                <Heart className={`w-4 h-4 ${bookmarks.includes(featured.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                  {featured.category}
                </span>
                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                  {featured.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {featured.prepTime}</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-rose-400" /> {featured.calories}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {featured.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Categories Bar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-100">Explore Categories</h3>
            <button 
              onClick={() => navigation.navigate('Catalog', { selectedCategory: 'All' })}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              See All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORIES.slice(1, 7).map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigation.navigate('Catalog', { selectedCategory: cat.id })}
                  className="bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all group"
                >
                  <div className={`p-2 rounded-lg ${cat.color} text-white mb-1.5 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Navigate CTA to Catalog */}
        <div className="pt-2">
          <button
            onClick={() => navigation.navigate('Catalog', { selectedCategory: 'All', searchQuery: '' })}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Recipe Catalog (navigation.navigate)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // SCREEN 2: CatalogScreen Component
  const CatalogScreen = ({ route, navigation }) => {
    const initialCategory = route?.params?.selectedCategory || 'All';
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState(route?.params?.searchQuery || '');

    const filteredRecipes = useMemo(() => {
      return RECIPES.filter(r => {
        const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              r.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      });
    }, [selectedCategory, searchQuery]);

    return (
      <div className="p-4 space-y-4 animate-fadeIn">
        {/* Custom Manual Back Button Row */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <button
            onClick={() => navigation.goBack()}
            className="flex items-center gap-1 text-xs text-amber-400 font-semibold hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>navigation.goBack()</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Params: &#123; category: "{selectedCategory}" &#125;
          </span>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Horizontal Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 border border-slate-700/70 hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Recipe Cards List */}
        <div className="space-y-3">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700">
              <Utensils className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="text-slate-300 text-sm font-medium">No recipes match your filter</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-2 text-xs text-amber-400 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigation.navigate('Details', {
                  recipeId: recipe.id,
                  recipeName: recipe.name,
                  recipe: recipe,
                  sourceScreen: 'Catalog List'
                })}
                className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex gap-3 hover:border-amber-500/60 cursor-pointer transition-all hover:scale-[1.01] group shadow-sm"
              >
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {recipe.category}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(recipe.id); }}
                        className="text-slate-400 hover:text-amber-400"
                      >
                        <Heart className={`w-3.5 h-3.5 ${bookmarks.includes(recipe.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 truncate">
                      {recipe.name}
                    </h4>
                    <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {recipe.prepTime}</span>
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-rose-400" /> {recipe.calories}</span>
                    </div>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5 text-[10px]">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // SCREEN 3: DetailsScreen Component
  const DetailsScreen = ({ route, navigation }) => {
    const { recipe, sourceScreen } = route.params || { recipe: RECIPES[0], sourceScreen: 'Direct' };
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const [completedSteps, setCompletedSteps] = useState({});
    const [activeDetailTab, setActiveDetailTab] = useState('ingredients'); // 'ingredients' | 'steps' | 'nutrition'

    const toggleIngredient = (idx) => {
      setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const toggleStep = (idx) => {
      setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const ingredientCount = recipe.ingredients.length;
    const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
    const stepCount = recipe.instructions.length;
    const stepsDoneCount = Object.values(completedSteps).filter(Boolean).length;

    return (
      <div className="animate-fadeIn pb-6">
        {/* Route Params Inspector Banner Badge */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono">
            <Info className="w-3.5 h-3.5" />
            <span>route.params payload loaded</span>
          </div>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400">
            From: <strong className="text-slate-200">{sourceScreen}</strong>
          </span>
        </div>

        {/* Hero Image Header */}
        <div className="relative h-52">
          <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            <button
              onClick={() => navigation.goBack()}
              className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-white hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md"
              title="navigation.goBack()"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleBookmark(recipe.id)}
              className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-white hover:text-amber-400 transition-colors"
            >
              <Heart className={`w-5 h-5 ${bookmarks.includes(recipe.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              {recipe.category}
            </span>
            <h2 className="text-xl font-black text-white mt-1 leading-tight">{recipe.name}</h2>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-slate-900/80 border-b border-slate-800 text-center text-xs">
          <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span className="text-slate-400 text-[10px]">Prep</span>
            <p className="font-bold text-slate-200">{recipe.prepTime}</p>
          </div>
          <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <Flame className="w-3.5 h-3.5 text-rose-400 mx-auto mb-1" />
            <span className="text-slate-400 text-[10px]">Calories</span>
            <p className="font-bold text-slate-200">{recipe.calories}</p>
          </div>
          <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
            <span className="text-slate-400 text-[10px]">Level</span>
            <p className="font-bold text-slate-200">{recipe.difficulty}</p>
          </div>
          <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
            <span className="text-slate-400 text-[10px]">Rating</span>
            <p className="font-bold text-slate-200">{recipe.rating}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Chef Description */}
          <p className="text-slate-300 text-xs leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            {recipe.description}
          </p>

          {/* Chef Pro Tip */}
          {recipe.chefNote && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2 text-xs">
              <ChefHat className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400">Chef's Secret Tip:</span>
                <p className="text-amber-200/80 mt-0.5">{recipe.chefNote}</p>
              </div>
            </div>
          )}

          {/* Interactive Details Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveDetailTab('ingredients')}
              className={`flex-1 py-2 text-center border-b-2 transition-all ${
                activeDetailTab === 'ingredients'
                  ? 'border-amber-500 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Ingredients ({checkedCount}/{ingredientCount})
            </button>
            <button
              onClick={() => setActiveDetailTab('steps')}
              className={`flex-1 py-2 text-center border-b-2 transition-all ${
                activeDetailTab === 'steps'
                  ? 'border-amber-500 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Instructions ({stepsDoneCount}/{stepCount})
            </button>
            <button
              onClick={() => setActiveDetailTab('nutrition')}
              className={`flex-1 py-2 text-center border-b-2 transition-all ${
                activeDetailTab === 'nutrition'
                  ? 'border-amber-500 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Nutrition
            </button>
          </div>

          {/* Tab 1: Checklist Ingredients */}
          {activeDetailTab === 'ingredients' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                <span>Tap items as you prepare</span>
                <span className="text-amber-400 font-mono">{Math.round((checkedCount/ingredientCount)*100)}% Ready</span>
              </div>
              {recipe.ingredients.map((ing, idx) => {
                const isDone = !!checkedIngredients[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-all ${
                      isDone 
                        ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 line-through' 
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isDone ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-600'}`} />
                    <span>{ing}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Step-by-Step Instructions */}
          {activeDetailTab === 'steps' && (
            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => {
                const isStepDone = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isStepDone
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                      isStepDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-amber-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <p className="text-xs leading-relaxed flex-1">{step}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Nutrition Breakdown */}
          {activeDetailTab === 'nutrition' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex justify-between items-center text-xs">
                <span className="text-slate-400">Protein</span>
                <span className="font-bold text-amber-400">{recipe.nutrition.protein}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex justify-between items-center text-xs">
                <span className="text-slate-400">Carbohydrates</span>
                <span className="font-bold text-amber-400">{recipe.nutrition.carbs}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex justify-between items-center text-xs">
                <span className="text-slate-400">Dietary Fats</span>
                <span className="font-bold text-amber-400">{recipe.nutrition.fat}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex justify-between items-center text-xs">
                <span className="text-slate-400">Dietary Fiber</span>
                <span className="font-bold text-amber-400">{recipe.nutrition.fiber}</span>
              </div>
            </div>
          )}

          {/* Action Buttons: Custom Manual Back Buttons */}
          <div className="pt-4 space-y-2">
            <button
              onClick={() => navigation.goBack()}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 text-xs transition-colors shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Perform navigation.goBack()</span>
            </button>

            <button
              onClick={() => navigation.popToTop()}
              className="w-full py-2.5 bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return directly to Stack Root (popToTop)</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentScreen = () => {
    switch (currentRoute.name) {
      case 'Home':
        return <HomeScreen navigation={navigation} route={currentRoute} />;
      case 'Catalog':
        return <CatalogScreen navigation={navigation} route={currentRoute} />;
      case 'Details':
        return <DetailsScreen navigation={navigation} route={currentRoute} />;
      default:
        return <HomeScreen navigation={navigation} route={currentRoute} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      
      {/* Top Navbar Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl shadow-md text-slate-950">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                Gourmet Bites
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  React Navigation Showcase
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Native Stack Navigator &amp; Parameter Passing Demonstration
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'app'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Interactive Mobile Viewport</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>TypeScript Code Explorer</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {activeTab === 'app' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive Mobile Viewport Frame */}
            <div className="lg:col-span-7 flex flex-col items-center">
              
              {/* Phone Shell */}
              <div className="w-full max-w-[390px] bg-slate-900 border-[8px] border-slate-800 rounded-[42px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700/50 min-h-[720px]">
                
                {/* Phone Top Speaker & Camera Notch */}
                <div className="bg-slate-950 h-6 flex justify-between items-center px-6 text-[10px] text-slate-400 font-medium select-none z-30">
                  <span>9:41</span>
                  <div className="w-20 h-3.5 bg-slate-900 rounded-b-xl mx-auto flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-4 h-2 bg-slate-300 rounded-sm" />
                  </div>
                </div>

                {/* React Navigation Header Bar Simulation */}
                <div className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 flex items-center justify-between z-20 shadow-sm">
                  <div className="flex items-center gap-2">
                    {navigation.canGoBack() ? (
                      <button
                        onClick={() => navigation.goBack()}
                        className="flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors py-1 pr-1"
                      >
                        <ChevronLeft className="w-5 h-5 -ml-1" />
                        <span>
                          {navStack[navStack.length - 2]?.name || 'Back'}
                        </span>
                      </button>
                    ) : (
                      <div className="p-1 text-amber-500">
                        <ChefHat className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <span className="font-bold text-sm text-slate-100 truncate max-w-[180px]">
                    {currentRoute.title || currentRoute.name}
                  </span>

                  <button
                    onClick={() => setShowParamInspector(!showParamInspector)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      showParamInspector 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                    title="Toggle Route Params Inspector"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Phone Dynamic Content Screen */}
                <div className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar relative">
                  {renderCurrentScreen()}
                </div>

                {/* Mobile Bottom Navigation / Home Indicator Bar */}
                <div className="bg-slate-900/90 backdrop-blur border-t border-slate-800/80 px-6 py-2 flex justify-around items-center text-[10px] text-slate-400 z-20">
                  <button 
                    onClick={() => navigation.popToTop()}
                    className={`flex flex-col items-center gap-0.5 ${currentRoute.name === 'Home' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'}`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Home</span>
                  </button>

                  <button 
                    onClick={() => navigation.navigate('Catalog', { selectedCategory: 'All' })}
                    className={`flex flex-col items-center gap-0.5 ${currentRoute.name === 'Catalog' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Catalog</span>
                  </button>

                  <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto my-1 absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none" />
                </div>

              </div>

            </div>

            {/* Right Column: Live Route Params & Navigation Inspector */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Stack History Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    React Navigation Stack State
                  </h3>
                  <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded-full text-amber-400 font-mono font-bold">
                    Depth: {navStack.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {navStack.map((step, idx) => {
                    const isCurrent = idx === navStack.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/50 text-slate-100 font-medium'
                            : 'bg-slate-800/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-200">{step.name}Screen</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                              {step.title}
                            </p>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => setNavStack(navStack.slice(0, idx + 1))}
                            className="text-[10px] text-amber-400 hover:underline"
                          >
                            Pop to here
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* JSON route.params Inspector Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Live <code className="text-amber-400 font-mono">route.params</code> Inspector
                  </h3>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono px-2 py-0.5 rounded">
                    useRoute() Hook
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">
                  Data object passed from previous screen via <code className="text-amber-300">navigation.navigate(screen, params)</code>:
                </p>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-64 scrollbar-thin">
                  <pre>{JSON.stringify(currentRoute.params, null, 2)}</pre>
                </div>
              </div>

              {/* Navigation Methods Helper Explanation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  Key Navigation Concepts Implemented:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                  <li><strong className="text-slate-200">navigation.navigate('Details', params)</strong>: Pushes screen &amp; injects data.</li>
                  <li><strong className="text-slate-200">navigation.goBack()</strong>: Pops top screen off native stack.</li>
                  <li><strong className="text-slate-200">route.params</strong>: Type-safe route parameters extracted in destination screen.</li>
                </ul>
              </div>

            </div>

          </div>
        ) : (
          /* MODE B: TypeScript Code Explorer Tab */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Code Header File Selector */}
            <div className="bg-slate-950 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {Object.keys(CODE_FILES).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedCodeFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                      selectedCodeFile === fileName
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed max-h-[650px] scrollbar-thin">
              <pre>{CODE_FILES[selectedCodeFile]}</pre>
            </div>

            {/* Code Footer Setup Instructions */}
            <div className="bg-slate-900 border-t border-slate-800 p-4 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-2">
              <div>
                <span className="font-bold text-slate-200">Required Packages: </span>
                <code className="text-amber-400">npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context</code>
              </div>
              <span className="text-[11px] text-slate-500">
                Compatible with Expo SDK 50+ &amp; React Native CLI
              </span>
            </div>

          </div>
        )}

      </main>

      {/* App Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>Gourmet Bites — Multi-Screen React Navigation (createNativeStackNavigator) Architecture Demo</p>
      </footer>

    </div>
  );
}