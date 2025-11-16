import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Scale, Flame, Pizza, Apple, Beef, Coffee, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FoodScanner() {
  const [scanning, setScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scannedFood, setScannedFood] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = () => {
    setScanning(true);
    // Simulação de scan
    setTimeout(() => {
      setScanning(false);
      setScannedFood({
        name: "Peito de Frango Grelhado",
        portion: "150g",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        sodium: 74,
        sugar: 0,
      });
      toast({
        title: "Alimento Escaneado!",
        description: "Informações nutricionais identificadas com sucesso",
      });
    }, 2000);
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

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scanner de Alimentos</h1>
        <p className="text-muted-foreground">Escaneie ou busque alimentos para ver informações nutricionais</p>
      </div>

      {/* Scanner Card */}
      <Card className="mb-8 border-primary/30 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Escanear Alimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-lg bg-muted/30">
            <Camera className={`w-16 h-16 mb-4 ${scanning ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm text-muted-foreground mb-4 text-center">
              {scanning ? 'Analisando alimento...' : 'Clique para escanear ou tire uma foto do alimento'}
            </p>
            <Button 
              onClick={handleScan} 
              disabled={scanning}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              {scanning ? 'Escaneando...' : 'Escanear Agora'}
            </Button>
          </div>

          {scannedFood && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h3 className="font-bold text-lg mb-3">{scannedFood.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Porção: {scannedFood.portion}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-background rounded-lg">
                  <Flame className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">{scannedFood.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <Scale className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">{scannedFood.protein}g</p>
                  <p className="text-xs text-muted-foreground">Proteína</p>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <p className="text-2xl font-bold">{scannedFood.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carboidrato</p>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <p className="text-2xl font-bold">{scannedFood.fat}g</p>
                  <p className="text-xs text-muted-foreground">Gordura</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-sm font-bold">{scannedFood.fiber}g</p>
                  <p className="text-xs text-muted-foreground">Fibra</p>
                </div>
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-sm font-bold">{scannedFood.sodium}mg</p>
                  <p className="text-xs text-muted-foreground">Sódio</p>
                </div>
                <div className="text-center p-2 bg-background rounded">
                  <p className="text-sm font-bold">{scannedFood.sugar}g</p>
                  <p className="text-xs text-muted-foreground">Açúcar</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Database */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar no Banco de Alimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Digite o nome do alimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredFoods.map((food, idx) => {
              const Icon = food.icon;
              return (
                <Card key={idx} className="hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{food.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{food.portion}</p>
                        <div className="flex gap-3 flex-wrap">
                          <Badge variant="secondary" className="gap-1">
                            <Flame className="w-3 h-3" />
                            {food.calories} kcal
                          </Badge>
                          <Badge variant="outline">{food.protein}g proteína</Badge>
                          <Badge variant="outline">{food.carbs}g carbs</Badge>
                          <Badge variant="outline">{food.fat}g gordura</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredFoods.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum alimento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
