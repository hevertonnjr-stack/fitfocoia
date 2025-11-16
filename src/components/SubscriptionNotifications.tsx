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
  { name: 'Plano Mensal', price: '24,90' },
  { name: 'Plano Trimestral', price: '59,90' },
  { name: 'Plano Semestral', price: '99,90' },
  { name: 'Plano Anual', price: '149,90' }
];

export function SubscriptionNotifications() {
  useEffect(() => {
    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      
      toast.success(`${randomName} acabou de assinar o ${randomPlan.name} de R$ ${randomPlan.price}! 🎉`, {
        duration: 4000,
        position: 'bottom-right',
      });
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
