
import React, { useState, useRef, useEffect } from 'react';
import { getNutritionFromImage, getNutritionFromText } from '../services/gemini';
import { 
  Camera, 
  Loader2, 
  CheckCircle, 
  Plus, 
  Upload, 
  Trash2, 
  X, 
  Aperture, 
  Scan, 
  Flame, 
  Zap, 
  Target, 
  Calculator,
  Info
} from 'lucide-react';
import { Meal } from '../types';

interface FoodVisionProps {
  onAddMeal: (meal: Omit<Meal, 'id' | 'date'>) => void;
}

interface CalcItem {
  id: string;
  food: string;
  amount: string;
}

const FoodVision: React.FC<FoodVisionProps> = ({ onAddMeal }) => {
  const [activeMode, setActiveMode] = useState<'lente' | 'calculadora'>('lente');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('Analisando sua refeição...');
  
  const [calcItems, setCalcItems] = useState<CalcItem[]>([
    { id: Math.random().toString(), food: '', amount: '' }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (loading) {
      const texts = ['Identificando alimentos...', 'Calculando porções...', 'Estimando macros...', 'Quase pronto...'];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const startCamera = async () => {
    stopCamera();
    setIsStreaming(true);
    setResult(null);
    setImage(null);

    // Give React a moment to render the video element
    setTimeout(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Câmera não suportada neste navegador.");
        }

        const constraints: MediaStreamConstraints = {
          video: { facingMode: 'environment' },
          audio: false
        };

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
          console.warn("Retrying with generic video constraints...");
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        console.error("Erro fatal ao acessar câmera:", err);
        setIsStreaming(false);
        alert("Erro ao abrir a câmera: " + (err.message || "Verifique se você concedeu as permissões necessárias."));
      }
    }, 300);
  };

  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg', 0.85);
      setImage(base64Data);
      
      stopCamera();
      
      const rawBase64 = base64Data.split(',')[1];
      setLoading(true);
      try {
        const data = await getNutritionFromImage(rawBase64);
        setResult(data);
      } catch (err) {
        console.error(err);
        alert("Erro na análise da imagem. Tente novamente ou use a galeria.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Full = event.target?.result as string;
      const base64 = base64Full.split(',')[1];
      setImage(base64Full);
      setLoading(true);
      try {
        const data = await getNutritionFromImage(base64);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addCalcItem = () => {
    setCalcItems(prev => [...prev, { id: Math.random().toString(), food: '', amount: '' }]);
  };

  const removeCalcItem = (id: string) => {
    if (calcItems.length > 1) {
      setCalcItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateCalcItem = (id: string, field: 'food' | 'amount', value: string) => {
    setCalcItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleEstimateManual = async () => {
    const validItems = calcItems.filter(i => i.food.trim() !== '');
    if (validItems.length === 0) return;
    
    setLoading(true);
    try {
      const data = await getNutritionFromText(validItems);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogMeal = () => {
    if (!result) return;
    onAddMeal({ ...result, type: 'lunch' });
    setResult(null);
    setImage(null);
    setCalcItems([{ id: Math.random().toString(), food: '', amount: '' }]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <canvas ref={canvasRef} className="hidden" />

      {!isStreaming && !result && (
        <div className="flex justify-center">
          <div className="bg-slate-200/50 p-1.5 rounded-[1.5rem] flex items-center shadow-inner border border-white/50">
            <button 
              onClick={() => { setActiveMode('lente'); setResult(null); setImage(null); }}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-[0.15em] ${
                activeMode === 'lente' 
                ? 'bg-white text-emerald-600 shadow-xl' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Scan size={16} /> Lente IA
            </button>
            <button 
              onClick={() => { setActiveMode('calculadora'); setResult(null); setImage(null); }}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-[0.15em] ${
                activeMode === 'calculadora' 
                ? 'bg-white text-emerald-600 shadow-xl' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calculator size={16} /> Calculadora
            </button>
          </div>
        </div>
      )}

      {activeMode === 'lente' ? (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center overflow-hidden relative min-h-[500px]">
          
          {isStreaming ? (
            <div className="w-full h-full flex flex-col items-center animate-in zoom-in-95 duration-500">
              <div className="relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden border-4 border-slate-100 shadow-2xl bg-black aspect-[4/3]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover" 
                />
                
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-emerald-500/30 rounded-[3rem] animate-pulse"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan-line"></div>
                </div>

                <button 
                  onClick={stopCamera}
                  className="absolute top-6 right-6 bg-white/10 text-white p-3 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
                >
                  <X size={20} />
                </button>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                  <button 
                    onClick={takePhoto}
                    className="group relative w-20 h-20 bg-white rounded-full flex items-center justify-center border-8 border-slate-900 shadow-2xl transform transition-all active:scale-90"
                  >
                    <Aperture size={32} className="text-slate-900" />
                  </button>
                </div>
              </div>
            </div>
          ) : !image && !result ? (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3.5rem] p-12 md:p-24 flex flex-col items-center w-full max-w-2xl group transition-all hover:border-emerald-200 hover:bg-emerald-50/10">
                <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <Camera size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Visão Artificial</h3>
                <p className="text-slate-500 text-center mb-12 max-w-sm font-medium leading-relaxed">
                  Tire uma foto do seu prato e deixe nossa IA identificar calorias e macros instantaneamente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button 
                    onClick={startCamera}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    Ativar Câmera
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-slate-400 border border-slate-200 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Upload size={18} /> Galeria
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>
          ) : null}
          
          {image && !result && (
            <div className="w-full max-w-2xl space-y-6 animate-in slide-in-from-bottom-8 duration-700">
               <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-white aspect-[4/3]">
                <img src={image} alt="Captura" className="w-full h-full object-cover" />
                {loading && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white px-8 text-center">
                    <Loader2 className="animate-spin text-emerald-500 mb-8" size={64} />
                    <p className="text-2xl font-black mb-2">{loadingText}</p>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Processando via IA</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-black text-slate-800">Cálculo Manual</h3>
              <p className="text-slate-400 font-medium">Insira os itens para estimar os macros totais</p>
            </div>
            <button 
              onClick={addCalcItem}
              className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm border border-emerald-100"
            >
              <Plus size={28} />
            </button>
          </div>

          <div className="space-y-6 mb-12 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {calcItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in slide-in-from-left-4 duration-300">
                <div className="md:col-span-7">
                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center focus-within:bg-white focus-within:border-emerald-500 transition-all">
                    <input 
                      type="text" 
                      placeholder="Ex: Frango Grelhado"
                      value={item.food}
                      onChange={(e) => updateCalcItem(item.id, 'food', e.target.value)}
                      className="w-full bg-transparent border-none outline-none px-2 font-bold text-slate-700"
                    />
                  </div>
                </div>
                <div className="md:col-span-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center focus-within:bg-white focus-within:border-emerald-500 transition-all">
                    <input 
                      type="text" 
                      placeholder="Ex: 150g"
                      value={item.amount}
                      onChange={(e) => updateCalcItem(item.id, 'amount', e.target.value)}
                      className="w-full bg-transparent border-none outline-none px-2 font-bold text-slate-700"
                    />
                  </div>
                </div>
                <div className="md:col-span-1 flex items-center justify-center">
                  <button 
                    onClick={() => removeCalcItem(item.id)}
                    className={`p-3 rounded-xl transition-all ${calcItems.length === 1 ? 'opacity-20 cursor-not-allowed' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                    disabled={calcItems.length === 1}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleEstimateManual}
            disabled={loading || calcItems.every(i => !i.food)}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.25em] text-xs hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Calculator size={20} className="text-emerald-500" />}
            {loading ? 'Estimando...' : 'Estimar Nutrientes'}
          </button>
        </div>
      )}

      {result && !loading && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{result.name}</h3>
                <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em]">Análise Concluída</p>
              </div>
              
              <div className="bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] flex flex-col items-center shadow-xl">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Calorias</p>
                <div className="flex items-end gap-1">
                   <span className="text-4xl font-black">{Math.round(result.calories)}</span>
                   <span className="text-sm font-bold text-slate-400 pb-1.5">kcal</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <MacroResultCard label="Proteínas" value={result.protein} color="emerald" icon={<Zap size={18} />} />
              <MacroResultCard label="Carboidratos" value={result.carbs} color="blue" icon={<Target size={18} />} />
              <MacroResultCard label="Gorduras" value={result.fats} color="amber" icon={<Flame size={18} />} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
              <button 
                onClick={handleLogMeal}
                className="flex-1 bg-emerald-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95"
              >
                <CheckCircle size={20} /> Registrar Refeição
              </button>
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="px-12 bg-white text-slate-400 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all border border-slate-100 active:scale-95"
              >
                Descartar
              </button>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex items-start gap-6">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-bold text-emerald-800 text-sm mb-1">Dica do NutiAI</h4>
                <p className="text-emerald-700/80 text-sm leading-relaxed">
                   Esta é uma estimativa baseada na análise visual. {result.protein > 25 ? " Excelente aporte proteico!" : " Refeição bem balanceada."}
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroResultCard = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: React.ReactNode }) => {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600'
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border ${styles[color]} group hover:bg-white hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{label}</p>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-black text-slate-800">{Math.round(value)}</span>
        <span className="text-sm font-bold text-slate-400 pb-1.5">g</span>
      </div>
      <div className="h-1.5 w-full bg-white/50 rounded-full mt-6 overflow-hidden">
         <div className={`h-full bg-current rounded-full transition-all duration-1000`} style={{ width: `${Math.min((value/50)*100, 100)}%` }}></div>
      </div>
    </div>
  );
};

export default FoodVision;
