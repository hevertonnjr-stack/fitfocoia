import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Flame, Zap, Star, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Challenge {
  id: string;
  challenge_type: string;
  challenge_name: string;
  challenge_description: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  reward_points: number;
}

interface UserPoints {
  total_points: number;
  level: number;
}

export default function Challenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints>({ total_points: 0, level: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/client-login");
      return;
    }
    loadChallenges();
    loadUserPoints();
  }, [user, navigate]);

  const loadChallenges = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_date", today);

    if (error) {
      console.error("Error loading challenges:", error);
    } else if (data && data.length > 0) {
      setChallenges(data);
    } else {
      await generateDailyChallenges();
    }
    
    setLoading(false);
  };

  const generateDailyChallenges = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const defaultChallenges = [
      {
        user_id: user.id,
        challenge_type: "steps",
        challenge_name: "10.000 Passos",
        challenge_description: "Complete 10.000 passos hoje",
        target_value: 10000,
        current_value: 0,
        challenge_date: today,
        reward_points: 50,
      },
      {
        user_id: user.id,
        challenge_type: "calories",
        challenge_name: "Queimar 500 Calorias",
        challenge_description: "Queime 500 calorias através de exercícios",
        target_value: 500,
        current_value: 0,
        challenge_date: today,
        reward_points: 40,
      },
      {
        user_id: user.id,
        challenge_type: "workout",
        challenge_name: "Treino Completo",
        challenge_description: "Complete pelo menos 1 treino hoje",
        target_value: 1,
        current_value: 0,
        challenge_date: today,
        reward_points: 30,
      },
      {
        user_id: user.id,
        challenge_type: "water",
        challenge_name: "Hidratação",
        challenge_description: "Beba 8 copos de água",
        target_value: 8,
        current_value: 0,
        challenge_date: today,
        reward_points: 20,
      },
    ];

    const { data, error } = await supabase
      .from("daily_challenges")
      .insert(defaultChallenges)
      .select();

    if (error) {
      console.error("Error creating challenges:", error);
    } else if (data) {
      setChallenges(data);
    }
  };

  const loadUserPoints = async () => {
    if (!user) return;

    let { data, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      const { data: newData, error: insertError } = await supabase
        .from("user_points")
        .insert({ user_id: user.id, total_points: 0, level: 1 })
        .select()
        .single();

      if (!insertError && newData) {
        data = newData;
      }
    }

    if (data) {
      setUserPoints(data);
    }
  };

  const updateChallengeProgress = async (challengeId: string, increment: number) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge || !user) return;

    const newValue = Math.min(challenge.current_value + increment, challenge.target_value);
    const isCompleted = newValue >= challenge.target_value;

    const { error } = await supabase
      .from("daily_challenges")
      .update({
        current_value: newValue,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq("id", challengeId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o desafio.",
        variant: "destructive",
      });
      return;
    }

    if (isCompleted && !challenge.completed) {
      await awardPoints(challenge.reward_points);
      toast({
        title: "🎉 Desafio Completo!",
        description: `Você ganhou ${challenge.reward_points} pontos!`,
      });
    }

    loadChallenges();
    loadUserPoints();
  };

  const awardPoints = async (points: number) => {
    if (!user) return;

    const newTotal = userPoints.total_points + points;
    const newLevel = Math.floor(newTotal / 100) + 1;

    await supabase
      .from("user_points")
      .update({
        total_points: newTotal,
        level: newLevel,
      })
      .eq("user_id", user.id);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "steps":
        return <TrendingUp className="w-6 h-6" />;
      case "calories":
        return <Flame className="w-6 h-6" />;
      case "workout":
        return <Target className="w-6 h-6" />;
      case "water":
        return <Zap className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <p className="text-center">Carregando desafios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Desafios Diários</h1>
        <p className="text-muted-foreground">Complete desafios e ganhe pontos!</p>
      </div>

      {/* User Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nível</p>
                <p className="text-3xl font-bold">{userPoints.level}</p>
              </div>
              <Award className="w-12 h-12 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pontos Totais</p>
                <p className="text-3xl font-bold">{userPoints.total_points}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completos Hoje</p>
                <p className="text-3xl font-bold">
                  {challenges.filter((c) => c.completed).length}/{challenges.length}
                </p>
              </div>
              <Trophy className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      <div className="grid gap-4">
        {challenges.map((challenge) => {
          const progress = (challenge.current_value / challenge.target_value) * 100;
          
          return (
            <Card key={challenge.id} className={challenge.completed ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${challenge.completed ? "bg-green-500/20" : "bg-primary/20"}`}>
                      {getChallengeIcon(challenge.challenge_type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{challenge.challenge_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{challenge.challenge_description}</p>
                    </div>
                  </div>
                  <Badge variant={challenge.completed ? "default" : "secondary"}>
                    {challenge.reward_points} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">
                      {challenge.current_value} / {challenge.target_value}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {!challenge.completed && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateChallengeProgress(challenge.id, 1)}
                    >
                      +1
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateChallengeProgress(challenge.id, 10)}
                    >
                      +10
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateChallengeProgress(challenge.id, challenge.target_value)}
                      className="ml-auto"
                    >
                      Marcar como Completo
                    </Button>
                  </div>
                )}

                {challenge.completed && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Desafio Completo!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
