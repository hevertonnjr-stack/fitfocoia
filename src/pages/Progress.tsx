import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Calendar, Target, Award } from "lucide-react";

const weightData = [
  { month: "Jan", weight: 95 },
  { month: "Fev", weight: 93 },
  { month: "Mar", weight: 91 },
  { month: "Abr", weight: 88 },
  { month: "Mai", weight: 86 },
  { month: "Jun", weight: 84 },
];

const caloriesData = [
  { day: "Seg", calories: 420 },
  { day: "Ter", calories: 380 },
  { day: "Qua", calories: 450 },
  { day: "Qui", calories: 410 },
  { day: "Sex", calories: 490 },
  { day: "Sáb", calories: 350 },
  { day: "Dom", calories: 300 },
];

const workoutData = [
  { week: "Sem 1", workouts: 3 },
  { week: "Sem 2", workouts: 4 },
  { week: "Sem 3", workouts: 5 },
  { week: "Sem 4", workouts: 4 },
];

export default function Progress() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Progresso</h1>
        <p className="text-muted-foreground">Acompanhe sua evolução</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">-11kg</p>
                <p className="text-xs text-muted-foreground">perdidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-muted-foreground">meses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Target className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">73%</p>
                <p className="text-xs text-muted-foreground">da meta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Award className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-muted-foreground">medalhas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weight" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weight">Peso</TabsTrigger>
          <TabsTrigger value="calories">Calorias</TabsTrigger>
          <TabsTrigger value="workouts">Treinos</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle>Calorias Queimadas (Esta Semana)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={caloriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Frequência de Treinos (Este Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievements */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Conquistas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Primeira Semana", emoji: "🎯" },
              { name: "10 Treinos", emoji: "💪" },
              { name: "5kg Perdidos", emoji: "🔥" },
              { name: "Sequência 7 Dias", emoji: "⚡" },
            ].map((achievement) => (
              <div
                key={achievement.name}
                className="p-4 rounded-lg bg-muted text-center hover:bg-primary/10 transition-colors"
              >
                <div className="text-4xl mb-2">{achievement.emoji}</div>
                <p className="text-sm font-medium">{achievement.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
