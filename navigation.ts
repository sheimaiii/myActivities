import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;