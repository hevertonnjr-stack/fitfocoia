import { useEffect } from 'react';
import { toast } from 'sonner';

const names = [
  'Maria Silva',
  'João Pedro',
  'Ana Costa',
  'Carlos Santos',
  'Juliana Oliveira',
  'Rafael Almeida',
  'Beatriz Lima',
  'Pedro Henrique',
  'Fernanda Souza',
  'Lucas Rodrigues',
  'Camila Ferreira',
  'Gabriel Costa',
  'Amanda Pereira',
  'Bruno Martins',
  'Larissa Santos',
  'Matheus Silva',
  'Isabela Alves',
  'Thiago Barbosa',
  'Carolina Mendes',
  'Felipe Gomes',
  'Mariana Rocha',
  'Diego Carvalho',
  'Patrícia Dias',
  'Rodrigo Monteiro',
  'Vanessa Lima'
];

const plans = [
  { name: 'Plano Mensal', price: '19,90', emoji: '⚡' },
  { name: 'Plano Trimestral', price: '38,90', emoji: '🔥' },
  { name: 'Plano Anual', price: '73,90', emoji: '💪' }
];

export function SubscriptionNotifications() {
  useEffect(() => {
    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      
      toast.success(
        `${randomPlan.emoji} ${randomName} acabou de assinar o ${randomPlan.name} de R$ ${randomPlan.price}!`, 
        {
          duration: 5000,
          position: 'top-right',
          className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-2xl border-2 border-green-400',
          style: {
            padding: '16px',
            fontSize: '15px',
          }
        }
      );
    };

    // Mostra primeira notificação após 2 segundos
    const initialTimeout = setTimeout(showNotification, 2000);

    // Depois mostra a cada 10 segundos
    const interval = setInterval(showNotification, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return null;
}
