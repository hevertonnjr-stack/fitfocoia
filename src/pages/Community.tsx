import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Trophy, TrendingUp, Users } from "lucide-react";

const posts = [
  {
    id: 1,
    author: "Maria Silva",
    avatar: "MS",
    time: "2h atrás",
    content: "Acabei de completar meu 30º dia consecutivo! 🔥 Nunca pensei que conseguiria, mas aqui estou! A comunidade me motiva todos os dias. Obrigada a todos!",
    likes: 42,
    comments: 8,
    achievement: "30 Dias Seguidos",
  },
  {
    id: 2,
    author: "João Santos",
    avatar: "JS",
    time: "5h atrás",
    content: "Perdi 5kg em 2 meses! O segredo é consistência e não desistir nos dias difíceis. Vamos que vamos! 💪",
    likes: 67,
    comments: 15,
    achievement: "5kg Perdidos",
  },
  {
    id: 3,
    author: "Ana Costa",
    avatar: "AC",
    time: "1d atrás",
    content: "Hoje foi dia de superar limites! Consegui fazer 50 burpees sem parar. Quem mais topa o desafio? 🎯",
    likes: 31,
    comments: 12,
  },
  {
    id: 4,
    author: "Pedro Oliveira",
    avatar: "PO",
    time: "1d atrás",
    content: "Transformação de 6 meses! De 95kg para 84kg. A jornada continua! #NeverGiveUp",
    likes: 128,
    comments: 34,
    achievement: "Transformação 6 Meses",
  },
];

const challenges = [
  {
    id: 1,
    name: "Desafio 100 Burpees",
    participants: 2341,
    daysLeft: 5,
    prize: "Medalha de Ouro",
  },
  {
    id: 2,
    name: "7 Dias de Sequência",
    participants: 1823,
    daysLeft: 3,
    prize: "Badge Especial",
  },
  {
    id: 3,
    name: "Queime 5000 Calorias",
    participants: 3912,
    daysLeft: 10,
    prize: "Troféu Digital",
  },
];

export default function Community() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Comunidade</h1>
        <p className="text-muted-foreground">Conecte-se e inspire-se</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.author}</h3>
                    <p className="text-sm text-muted-foreground">{post.time}</p>
                  </div>
                  {post.achievement && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Trophy className="w-3 h-3 mr-1" />
                      {post.achievement}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Desafios Ativos
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <h4 className="font-semibold mb-2">{challenge.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants.toLocaleString()} participantes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {challenge.daysLeft} dias restantes
                    </span>
                    <Button size="sm" variant="outline">
                      Participar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top da Semana
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Carlos M.", points: 2450, rank: 1 },
                { name: "Beatriz L.", points: 2280, rank: 2 },
                { name: "Rafael P.", points: 2150, rank: 3 },
                { name: "Julia S.", points: 2020, rank: 4 },
                { name: "Marcos V.", points: 1890, rank: 5 },
              ].map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {user.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.points} pontos</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
