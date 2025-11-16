import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Scale, Flame, Pizza, Apple, Beef, Coffee, Search, History, TrendingUp, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface FoodAnalysis {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  healthScore: number;
  recommendations: string[];
  warnings: string[];
  timestamp: string;
}

export default function FoodScanner() {
  const [scanning, setScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scannedFood, setScannedFood] = useState<FoodAnalysis | null>(null);
  const [scanHistory, setScanHistory] = useState<FoodAnalysis[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analyzeFood = async (imageBase64: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { image: imageBase64 }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing food:', error);
      throw error;
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setScanning(true);
    setImagePreview(URL.createObjectURL(file));

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        try {
          const analysis = await analyzeFood(base64);
          
          const foodData: FoodAnalysis = {
            ...analysis,
            timestamp: new Date().toISOString()
          };
          
          setScannedFood(foodData);
          setScanHistory(prev => [foodData, ...prev].slice(0, 10));
          
          toast({
            title: "Análise Concluída! 🎉",
            description: `${analysis.name} identificado com sucesso`,
          });
        } catch (error) {
          toast({
            title: "Erro na Análise",
            description: "Não foi possível analisar a imagem. Tente novamente.",
            variant: "destructive"
          });
        } finally {
          setScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setScanning(false);
      toast({
        title: "Erro",
        description: "Erro ao processar imagem",
        variant: "destructive"
      });
    }
  };

  const handleCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleGallery = () => {
    fileInputRef.current?.click();
  };

  const foodDatabase = [
    { icon: Pizza, name: "Pizza Margherita", calories: 250, portion: "1 fatia (100g)", protein: 11, carbs: 30, fat: 10 },
    { icon: Apple, name: "Maçã", calories: 52, portion: "1 unidade média (130g)", protein: 0.3, carbs: 14, fat: 0.2 },
    { icon: Beef, name: "Bife de Carne", calories: 250, portion: "100g", protein: 26, carbs: 0, fat: 15 },
    { icon: Coffee, name: "Café Preto", calories: 2, portion: "1 xícara (240ml)", protein: 0.3, carbs: 0, fat: 0 },
    { icon: Pizza, name: "Arroz Branco", calories: 130, portion: "100g cozido", protein: 2.7, carbs: 28, fat: 0.3 },
    { icon: Apple, name: "Banana", calories: 89, portion: "1 unidade média (118g)", protein: 1.1, carbs: 23, fat: 0.3 },
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scanner de Alimentos AI</h1>
        <p className="text-muted-foreground">Análise nutricional inteligente com IA</p>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="database">Buscar</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <Card className="border-primary/30 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Escanear com IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-lg bg-muted/30">
                {imagePreview && !scanning && (
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mb-4" />
                )}
                
                {scanning ? (
                  <>
                    <Camera className="w-16 h-16 mb-4 animate-pulse text-primary" />
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Analisando com IA...
                    </p>
                    <Progress value={66} className="w-full max-w-xs" />
                  </>
                ) : (
                  <>
                    <Camera className="w-16 h-16 mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Tire uma foto ou escolha da galeria
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleCamera}
                        className="gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Câmera
                      </Button>
                      <Button 
                        onClick={handleGallery}
                        variant="outline"
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Galeria
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {scannedFood && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{scannedFood.name}</h3>
                        <p className="text-sm text-muted-foreground">Porção: {scannedFood.portion}</p>
                      </div>
                      <Badge className={getHealthColor(scannedFood.healthScore)}>
                        Score: {scannedFood.healthScore}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <p className="text-2xl font-bold">{scannedFood.calories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Scale className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                        <p className="text-2xl font-bold">{scannedFood.protein}g</p>
                        <p className="text-xs text-muted-foreground">Proteína</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Pizza className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                        <p className="text-2xl font-bold">{scannedFood.carbs}g</p>
                        <p className="text-xs text-muted-foreground">Carboidratos</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Apple className="w-5 h-5 mx-auto mb-1 text-red-500" />
                        <p className="text-2xl font-bold">{scannedFood.fat}g</p>
                        <p className="text-xs text-muted-foreground">Gordura</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-background rounded text-center">
                        <p className="font-semibold">{scannedFood.fiber}g</p>
                        <p className="text-xs text-muted-foreground">Fibra</p>
                      </div>
                      <div className="p-2 bg-background rounded text-center">
                        <p className="font-semibold">{scannedFood.sodium}mg</p>
                        <p className="text-xs text-muted-foreground">Sódio</p>
                      </div>
                      <div className="p-2 bg-background rounded text-center">
                        <p className="font-semibold">{scannedFood.sugar}g</p>
                        <p className="text-xs text-muted-foreground">Açúcar</p>
                      </div>
                    </div>
                  </div>

                  {scannedFood.recommendations.length > 0 && (
                    <Card className="border-green-500/30 bg-green-500/5">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Recomendações
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {scannedFood.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {scannedFood.warnings.length > 0 && (
                    <Card className="border-yellow-500/30 bg-yellow-500/5">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          Atenção
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {scannedFood.warnings.map((warn, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <XCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{warn}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Análises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma análise realizada ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {scanHistory.map((food, idx) => (
                    <div 
                      key={idx}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setScannedFood(food)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{food.name}</h4>
                          <p className="text-sm text-muted-foreground">{food.portion}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(food.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{food.calories}</p>
                          <p className="text-xs text-muted-foreground">kcal</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar alimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredFoods.map((food, idx) => {
              const Icon = food.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{food.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{food.portion}</p>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="secondary">{food.calories} kcal</Badge>
                          <Badge variant="outline">{food.protein}g proteína</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
