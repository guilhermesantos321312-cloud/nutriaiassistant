
export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealDetail {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DayPlan {
  dayName: string;
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
  snack: MealDetail;
}

export interface SavedDiet {
  id: string;
  name: string;
  createdAt: string;
  targets: DailyGoal;
  days: DayPlan[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface WorkoutSession {
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface Workout {
  name: string;
  goal: string;
  sessions: WorkoutSession[];
}

export interface SavedWorkout {
  id: string;
  name: string;
  createdAt: string;
  goal: string;
  level: string;
  sessions: WorkoutSession[];
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface Notification {
  id: string;
  // Added 'water' to resolve type mismatch in NotificationSystem component
  type: 'meal' | 'workout' | 'info' | 'water';
  title: string;
  message: string;
}
