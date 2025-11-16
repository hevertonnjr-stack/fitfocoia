import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Flame, TrendingUp, Target, BookOpen } from "lucide-react";

const workouts = [
  {
    id: 1,
    title: "HIIT Queima Gordura",
    duration: "20 min",
    calories: 250,
    level: "Intermediário",
    category: "Cardio",
    exercises: 8,
    icon: Flame,
    instructions: [
      "Aqueça por 3 minutos com polichinelos leves",
      "30 segundos de burpees em alta intensidade",
      "15 segundos de descanso",
      "30 segundos de mountain climbers",
      "15 segundos de descanso",
      "Repita o circuito 4 vezes",
      "Finalize com alongamento de 3 minutos"
    ]
  },
  {
    id: 2,
    title: "Força Total",
    duration: "35 min",
    calories: 180,
    level: "Avançado",
    category: "Força",
    exercises: 12,
    icon: Dumbbell,
    instructions: [
      "Aquecimento: 5 minutos de mobilidade articular",
      "Flexões: 4 séries de 15 repetições",
      "Agachamentos: 4 séries de 20 repetições",
      "Prancha: 4 séries de 45 segundos",
      "Descanso de 45 segundos entre séries",
      "Finalize com alongamento completo"
    ]
  },
  {
    id: 3,
    title: "Core & Abdômen",
    duration: "15 min",
    calories: 120,
    level: "Iniciante",
    category: "Core",
    exercises: 6,
    icon: Target,
    instructions: [
      "Prancha frontal: 3 séries de 30 segundos",
      "Prancha lateral (cada lado): 2 séries de 20 segundos",
      "Bicicleta no ar: 3 séries de 20 repetições",
      "Elevação de pernas: 3 séries de 15 repetições",
      "Descanso de 30 segundos entre exercícios"
    ]
  },
  {
    id: 4,
    title: "Pernas Explosivas",
    duration: "30 min",
    calories: 280,
    level: "Intermediário",
    category: "Pernas",
    exercises: 10,
    icon: TrendingUp,
    instructions: [
      "Aquecimento com agachamento livre: 2 minutos",
      "Agachamentos com salto: 4 séries de 12 repetições",
      "Afundos alternados: 3 séries de 15 por perna",
      "Stiff unilateral: 3 séries de 12 por perna",
      "Panturrilha em pé: 4 séries de 20 repetições",
      "Alongamento focado em posteriores: 5 minutos"
    ]
  },
  {
    id: 5,
    title: "Resistência",
    duration: "40 min",
    calories: 320,
    level: "Avançado",
    category: "Cardio",
    exercises: 15,
    icon: Clock,
    instructions: [
      "Aquecimento progressivo: 5 minutos",
      "Corrida estacionária: 3 minutos em ritmo moderado",
      "Burpees: 1 minuto intenso",
      "Jump squats: 1 minuto",
      "Mountain climbers: 1 minuto",
      "Descanso: 1 minuto",
      "Repita o circuito 5 vezes",
      "Desaquecimento com caminhada: 5 minutos"
    ]
  },
  {
    id: 6,
    title: "Alongamento Completo",
    duration: "20 min",
    calories: 80,
    level: "Iniciante",
    category: "Flexibilidade",
    exercises: 8,
    icon: BookOpen,
    instructions: [
      "Respiração profunda: 2 minutos",
      "Alongamento de pescoço e ombros: 3 minutos",
      "Alongamento de braços e tronco: 4 minutos",
      "Alongamento de quadril: 3 minutos",
      "Alongamento de pernas (isquiotibiais): 4 minutos",
      "Alongamento de panturrilhas: 2 minutos",
      "Respiração final e relaxamento: 2 minutos"
    ]
  },
  {
    id: 7,
    title: "Upper Body Strength",
    duration: "35 min",
    calories: 220,
    level: "Intermediário",
    category: "Força",
    exercises: 10,
    icon: Dumbbell,
    instructions: [
      "Aquecimento com rotação de ombros: 3 minutos",
      "Flexões diamante: 3 séries de 12 repetições",
      "Flexões abertas: 3 séries de 15 repetições",
      "Tríceps no banco: 3 séries de 12 repetições",
      "Rosca com elástico: 3 séries de 15 repetições",
      "Remada unilateral: 3 séries de 12 por lado",
      "Alongamento de membros superiores: 5 minutos"
    ]
  },
  {
    id: 8,
    title: "Yoga Flow Matinal",
    duration: "25 min",
    calories: 100,
    level: "Iniciante",
    category: "Flexibilidade",
    exercises: 12,
    icon: BookOpen,
    instructions: [
      "Respiração consciente em posição meditativa: 3 minutos",
      "Saudação ao sol: 5 repetições",
      "Postura do guerreiro I e II: 2 minutos cada lado",
      "Postura da árvore: 1 minuto cada perna",
      "Postura da criança: 2 minutos",
      "Torção espinhal sentado: 1 minuto cada lado",
      "Relaxamento final: 5 minutos"
    ]
  },
  {
    id: 9,
    title: "Cardio Intenso",
    duration: "25 min",
    calories: 350,
    level: "Avançado",
    category: "Cardio",
    exercises: 8,
    icon: Flame,
    instructions: [
      "Aquecimento dinâmico: 3 minutos",
      "Sprints no lugar: 30 segundos ON / 30 segundos OFF",
      "Jumping jacks: 1 minuto",
      "High knees: 1 minuto",
      "Tuck jumps: 30 segundos ON / 30 segundos OFF",
      "Skater jumps: 1 minuto",
      "Repita circuito 3 vezes",
      "Caminhada leve: 3 minutos"
    ]
  },
  {
    id: 10,
    title: "Glúteos e Posterior",
    duration: "30 min",
    calories: 200,
    level: "Intermediário",
    category: "Pernas",
    exercises: 9,
    icon: TrendingUp,
    instructions: [
      "Aquecimento com ativação de glúteos: 4 minutos",
      "Agachamento sumo: 4 séries de 15 repetições",
      "Ponte de glúteos: 4 séries de 20 repetições",
      "Afundo reverso: 3 séries de 12 por perna",
      "Coice de glúteo: 3 séries de 15 por perna",
      "Fire hydrant: 3 séries de 15 por lado",
      "Alongamento focado: 4 minutos"
    ]
  },
  {
    id: 11,
    title: "Mobilidade Total",
    duration: "20 min",
    calories: 90,
    level: "Iniciante",
    category: "Flexibilidade",
    exercises: 10,
    icon: BookOpen,
    instructions: [
      "Rotação de pescoço: 1 minuto",
      "Círculos de ombros: 2 minutos",
      "Rotação de quadril: 2 minutos",
      "Cat-cow: 2 minutos",
      "Rotação torácica: 2 minutos",
      "Círculos de tornozelo: 2 minutos",
      "Alongamento de flexores de quadril: 3 minutos",
      "Alongamento geral: 6 minutos"
    ]
  },
  {
    id: 12,
    title: "CrossFit Style",
    duration: "45 min",
    calories: 400,
    level: "Avançado",
    category: "Força",
    exercises: 16,
    icon: Dumbbell,
    instructions: [
      "Aquecimento funcional: 5 minutos",
      "21-15-9 reps de:",
      "Burpees + Agachamentos + Flexões",
      "Descanso: 2 minutos",
      "AMRAP 10 minutos:",
      "10 jump squats + 15 mountain climbers + 20 jumping jacks",
      "Descanso: 3 minutos",
      "EMOM 10 minutos: 10 burpees + 15 abdominais",
      "Desaquecimento: 5 minutos"
    ]
  }
];

export default function Workouts() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Treinos</h1>
        <p className="text-muted-foreground">Escolha seu treino e comece agora</p>
      </div>

      {/* Workouts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => {
          const Icon = workout.icon;
          return (
            <Card key={workout.id} className="hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline">{workout.level}</Badge>
                </div>
                <CardTitle>{workout.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-muted-foreground" />
                    <span>{workout.calories}kcal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4 text-muted-foreground" />
                    <span>{workout.exercises} ex</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Instruções:</p>
                  <ul className="text-sm space-y-1">
                    {workout.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-muted-foreground">• {instruction}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
