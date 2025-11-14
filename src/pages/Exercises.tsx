import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Clock, Target } from "lucide-react";
import { useState } from "react";

const exercises = [
  {
    id: 1,
    name: "Burpees",
    category: "Cardio",
    difficulty: "Avançado",
    duration: "30 seg",
    calories: "15 kcal",
    target: "Full Body",
  },
  {
    id: 2,
    name: "Mountain Climbers",
    category: "Cardio",
    difficulty: "Intermediário",
    duration: "45 seg",
    calories: "12 kcal",
    target: "Core & Cardio",
  },
  {
    id: 3,
    name: "Jump Squats",
    category: "Pernas",
    difficulty: "Intermediário",
    duration: "30 seg",
    calories: "10 kcal",
    target: "Pernas & Glúteos",
  },
  {
    id: 4,
    name: "Prancha",
    category: "Core",
    difficulty: "Iniciante",
    duration: "60 seg",
    calories: "8 kcal",
    target: "Abdômen",
  },
  {
    id: 5,
    name: "High Knees",
    category: "Cardio",
    difficulty: "Iniciante",
    duration: "30 seg",
    calories: "10 kcal",
    target: "Cardio & Pernas",
  },
  {
    id: 6,
    name: "Push-ups",
    category: "Força",
    difficulty: "Intermediário",
    duration: "45 seg",
    calories: "9 kcal",
    target: "Peito & Braços",
  },
  {
    id: 7,
    name: "Jumping Jacks",
    category: "Cardio",
    difficulty: "Iniciante",
    duration: "60 seg",
    calories: "11 kcal",
    target: "Full Body",
  },
  {
    id: 8,
    name: "Lunges",
    category: "Pernas",
    difficulty: "Iniciante",
    duration: "45 seg",
    calories: "8 kcal",
    target: "Pernas",
  },
];

const categories = ["Todos", "Cardio", "Força", "Core", "Pernas"];

export default function Exercises() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Biblioteca de Exercícios</h1>
        <p className="text-muted-foreground">Aprenda a técnica perfeita</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar exercícios..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:border-primary/50 transition-all group cursor-pointer">
            <CardContent className="pt-6">
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Play className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{exercise.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {exercise.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{exercise.category}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{exercise.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{exercise.calories}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{exercise.target}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum exercício encontrado</p>
        </div>
      )}
    </div>
  );
}
