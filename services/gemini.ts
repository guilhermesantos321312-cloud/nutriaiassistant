
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Workout, ChatMessage, SavedDiet } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealDetailSchema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fats: { type: Type.NUMBER },
  },
  required: ["description", "calories", "protein", "carbs", "fats"]
};

export const generateMealPlan = async (profile: {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
  restrictions: string;
}) => {
  const model = 'gemini-3-pro-preview';
  const prompt = `Crie um plano alimentar completo para 7 dias (Segunda a Domingo).
  Perfil: ${profile.age} anos, ${profile.gender}, ${profile.height}cm, ${profile.weight}kg, Nível de Atividade: ${profile.activity}, Objetivo: ${profile.goal}.
  Restrições: ${profile.restrictions}.
  
  Importante: Estime os macros (calorias, proteinas, carbos, gorduras) INDIVIDUALMENTE para cada refeição de cada dia.
  Responda estritamente em Português do Brasil no formato JSON.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      // Thinking budget must be non-zero for gemini-3-pro-preview
      thinkingConfig: { thinkingBudget: 16384 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targets: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
            },
            required: ["calories", "protein", "carbs", "fats"]
          },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayName: { type: Type.STRING },
                breakfast: mealDetailSchema,
                lunch: mealDetailSchema,
                dinner: mealDetailSchema,
                snack: mealDetailSchema,
              },
              required: ["dayName", "breakfast", "lunch", "dinner", "snack"]
            }
          }
        },
        required: ["targets", "days"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getNutritionFromImage = async (base64Image: string) => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: "Analise esta imagem de comida. Forneça o nome estimado do prato (em português), calorias, proteínas, carboidratos e gorduras totais. Formate a resposta como JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
        },
        required: ["name", "calories", "protein", "carbs", "fats"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getNutritionFromText = async (items: { food: string; amount: string }[]) => {
  const model = 'gemini-3-flash-preview';
  const itemsDescription = items.map(i => `${i.amount} de ${i.food}`).join(', ');
  const prompt = `Analise os seguintes itens alimentares e estime os valores nutricionais totais (soma de todos os itens).
  Itens: ${itemsDescription}.
  Forneça o nome (ex: "Refeição Personalizada"), calorias totais, proteínas, carboidratos e gorduras.
  Responda estritamente em Português do Brasil no formato JSON.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
        },
        required: ["name", "calories", "protein", "carbs", "fats"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getNutritionAdvice = async (prompt: string, history: ChatMessage[]) => {
    const model = 'gemini-3-flash-preview';
    const formattedHistory = history.map(m => `${m.role === 'user' ? 'Usuário' : 'NutiAI'}: ${m.text}`).join('\n');
    const fullPrompt = `${formattedHistory}\nUsuário: ${prompt}\nNutiAI:`;

    const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
            systemInstruction: "Você é o NutiAI, um assistente virtual especialista em nutrição e saúde.",
        }
    });
    return response.text || 'Desculpe, não consegui processar sua solicitação no momento.';
};

export const generateRecipe = async (ingredients: string[]): Promise<Recipe> => {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: `Crie uma receita saudável e rápida com: ${ingredients.join(', ')}. Responda em Português.`,
        config: {
            // Flash models can have thinkingBudget set to 0 if desired, but 0 might fail on some versions
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    macros: {
                        type: Type.OBJECT,
                        properties: {
                            calories: { type: Type.NUMBER },
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fats: { type: Type.NUMBER },
                        }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text || '{}');
};

export const generateWorkout = async (params: {
  goal: string,
  level: string,
  location: string,
  daysPerWeek: string,
  limitations: string
}): Promise<Workout> => {
    const model = 'gemini-3-pro-preview';
    const prompt = `Crie uma rotina de treinos completa baseada em ${params.daysPerWeek} dias de treino por semana.
    Você deve gerar EXATAMENTE ${params.daysPerWeek} sessões de treino diferentes (ex: Treino A, Treino B, Treino C...).
    
    Perfil:
    - Objetivo: ${params.goal}
    - Nível: ${params.level}
    - Local: ${params.location}
    - Limitações: ${params.limitations || 'Nenhuma'}
    
    Cada sessão deve ter um foco (ex: Peito e Tríceps) e uma lista de exercícios com séries, repetições e tempo de descanso.
    Responda em Português do Brasil no formato JSON.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            // Thinking budget must be non-zero for gemini-3-pro-preview
            thinkingConfig: { thinkingBudget: 16384 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    sessions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                dayName: { type: Type.STRING, description: "Ex: Treino A, Treino B..." },
                                focus: { type: Type.STRING, description: "Ex: Membros Superiores" },
                                exercises: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            sets: { type: Type.NUMBER },
                                            reps: { type: Type.STRING },
                                            rest: { type: Type.STRING },
                                        },
                                        required: ["name", "sets", "reps", "rest"]
                                    }
                                }
                            },
                            required: ["dayName", "focus", "exercises"]
                        }
                    }
                },
                required: ["name", "goal", "sessions"]
            }
        }
    });
    return JSON.parse(response.text || '{}');
};
