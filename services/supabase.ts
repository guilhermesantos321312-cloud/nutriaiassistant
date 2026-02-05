import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ou chave anônima não configuradas. Verifique o arquivo .env.local');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ============================================
// Funções de Autenticação
// ============================================

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) throw error;
    
    // Criar perfil do usuário
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email
      });
    }
    
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: { name?: string; base_goal?: object; active_diet_id?: string | null }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ============================================
// Serviço de Refeições
// ============================================

export const mealsService = {
  async getMeals(userId: string, date?: string) {
    let query = supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async addMeal(userId: string, meal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: string;
  }) {
    const { data, error } = await supabase
      .from('meals')
      .insert({ ...meal, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMeal(mealId: string) {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);
    
    if (error) throw error;
  }
};

// ============================================
// Serviço de Dietas Salvas
// ============================================

export const dietsService = {
  async getDiets(userId: string) {
    const { data, error } = await supabase
      .from('saved_diets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async saveDiet(userId: string, diet: {
    name: string;
    targets: object;
    days: object[];
  }) {
    const { data, error } = await supabase
      .from('saved_diets')
      .insert({ ...diet, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDiet(dietId: string) {
    const { error } = await supabase
      .from('saved_diets')
      .delete()
      .eq('id', dietId);
    
    if (error) throw error;
  }
};

// ============================================
// Serviço de Treinos Salvos
// ============================================

export const workoutsService = {
  async getWorkouts(userId: string) {
    const { data, error } = await supabase
      .from('saved_workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async saveWorkout(userId: string, workout: {
    name: string;
    goal: string;
    level: string;
    sessions: object[];
  }) {
    const { data, error } = await supabase
      .from('saved_workouts')
      .insert({ ...workout, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteWorkout(workoutId: string) {
    const { error } = await supabase
      .from('saved_workouts')
      .delete()
      .eq('id', workoutId);
    
    if (error) throw error;
  }
};
