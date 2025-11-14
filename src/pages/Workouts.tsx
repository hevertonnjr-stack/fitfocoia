import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Flame, Zap, Heart, Target, TrendingUp } from "lucide-react";

const workouts = [
  {
    id: 1,
    title: "HIIT Queima Gordura",
    duration: "30 min",
    calories: "400 kcal",
    level: "Intermediário",
    category: "HIIT",
    exercises: 8,
    icon: Zap,
  },
  {
    id: 2,
    title: "Cardio Intenso",
    duration: "45 min",
    calories: "550 kcal",
    level: "Avançado",
    category: "Cardio",
    exercises: 10,
    icon: Heart,
  },
  {
    id: 3,
    title: "Core & Abs Definição",
    duration: "20 min",
    calories: "200 kcal",
    level: "Iniciante",
    category: "Abdômen",
    exercises: 6,
    icon: Target,
  },
  {
    id: 4,
    title: "Full Body Queima",
    duration: "35 min",
    calories: "450 kcal",
    level: "Intermediário",
    category: "Full Body",
    exercises: 9,
    icon: TrendingUp,
  },
  {
    id: 5,
    title: "Tabata Explosivo",
    duration: "25 min",
    calories: "380 kcal",
    level: "Avançado",
    category: "Tabata",
    exercises: 8,
    icon: Zap,
  },
  {
    id: 6,
    title: "Low Impact Fat Burn",
    duration: "40 min",
    calories: "320 kcal",
    level: "Iniciante",
    category: "Baixo Impacto",
    exercises: 7,
    icon: Heart,
  },
];

export default function Workouts() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Treinos</h1>
        <p className="text-muted-foreground">Escolha seu próximo desafio</p>
      </div>

      {/* Featured Workout */}
      <Card className="mb-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
        <CardContent className="pt-6">
          <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">Recomendado</Badge>
          <h2 className="text-2xl font-bold mb-2">Plano de 30 Dias</h2>
          <p className="text-muted-foreground mb-4">
            Transforme seu corpo com nosso programa completo gerado por IA
          </p>
          <Button size="lg" className="gap-2">
            <Play className="w-4 h-4" />
            Gerar Meu Plano
          </Button>
        </CardContent>
      </Card>

      {/* Workouts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => {
          const Icon = workout.icon;
          return (
            <Card key={workout.id} className="hover:border-primary/50 transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline">{workout.level}</Badge>
                </div>

                <h3 className="text-lg font-bold mb-2">{workout.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{workout.category}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workout.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {workout.calories}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{workout.exercises} exercícios</p>

                <Button className="w-full gap-2" variant="outline">
                  <Play className="w-4 h-4" />
                  Iniciar Treino
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
