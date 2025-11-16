"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: 'Plano Mensal',
    description: 'Ideal para quem quer experimentar e começar a transformação',
    price: 24.90,
    yearlyPrice: 24.90,
    buttonText: 'Começar Agora',
    buttonVariant: 'outline' as const,
    planType: 'mensal' as const,
    includes: [
      'Inclui:',
      'Acesso completo ao app',
      'Todos os treinos',
      'Acompanhamento de progresso',
      'Suporte prioritário',
      'Renovação automática'
    ]
  },
  {
    name: 'Plano Trimestral',
    description: 'Melhor custo-benefício para resultados consistentes',
    price: 57.90,
    yearlyPrice: 57.90,
    originalPrice: 89.70,
    buttonText: 'Começar Agora',
    buttonVariant: 'default' as const,
    popular: true,
    discount: '35% OFF',
    planType: 'trimestral' as const,
    includes: [
      'Tudo do Mensal, mais:',
      'Economia de 35%',
      'Treinos exclusivos',
      'Plano nutricional',
      'Suporte VIP',
      '🔥 Melhor escolha'
    ]
  },
  {
    name: 'Plano Anual',
    description: 'Máxima economia para transformação completa',
    price: 99.90,
    yearlyPrice: 99.90,
    originalPrice: 298.80,
    buttonText: 'Começar Agora',
    buttonVariant: 'outline' as const,
    discount: '66% OFF',
    planType: 'anual' as const,
    includes: [
      'Tudo do Trimestral, mais:',
      'Economia de 66%',
      'Acompanhamento premium',
      'Consultoria mensal',
      'Acesso vitalício bônus',
      '💎 Máxima economia'
    ]
  }
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-neutral-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-green-600 border-green-600 bg-gradient-to-t from-green-500 to-green-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Mensal</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-green-600 border-green-600 bg-gradient-to-t from-green-500 to-green-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Anual</span>
        </button>
      </div>
    </div>
  );
};

interface PricingSectionEnhancedProps {
  onPlanClick: (planType: 'mensal' | 'trimestral' | 'anual') => void;
}

export default function PricingSectionEnhanced({ onPlanClick }: PricingSectionEnhancedProps) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden py-24"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#22c55e"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="framer-1i5axl2">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #22c55e",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
          ></div>
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #22c55e",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
          ></div>
        </div>
      </TimelineContent>

      <article className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-2 relative z-50 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-white">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Escolha o Plano Perfeito para Você
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-300 text-lg"
        >
          Mais de 10.000 pessoas já transformaram suas vidas. Escolha seu plano e comece hoje!
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, #22c55e 0%, transparent 70%)`,
          opacity: 0.3,
          mixBlendMode: "multiply",
        }}
      />

      <div className="grid md:grid-cols-3 max-w-6xl gap-8 py-6 mx-auto px-4">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative text-white border-neutral-800 ${
                plan.popular
                  ? "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0px_-13px_300px_0px_#22c55e] z-20"
                  : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              {plan.discount && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {plan.discount}
                  </span>
                </div>
              )}
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl mb-2 font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-300 mr-1">R$</span>
                  <NumberFlow
                    format={{
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    value={isYearly && plan.name === 'Plano Anual' ? plan.yearlyPrice : plan.price}
                    className="text-4xl font-black"
                  />
                  <span className="text-gray-300 ml-1 text-sm">
                    /{plan.name === 'Plano Anual' ? 'ano' : plan.name === 'Plano Trimestral' ? '3 meses' : 'mês'}
                  </span>
                </div>
                {plan.originalPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    De R$ {plan.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-sm text-gray-300 mb-4">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  onClick={() => onPlanClick(plan.planType)}
                  className={`w-full mb-6 p-4 text-xl rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group ${
                    plan.popular
                      ? "bg-gradient-to-t from-green-500 to-green-600 shadow-lg shadow-green-800 border border-green-500 text-white hover:shadow-green-700 hover:scale-105"
                      : "bg-gradient-to-t from-neutral-950 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-800 text-white hover:border-green-500 hover:scale-105"
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="space-y-3 pt-4 border-t border-neutral-700">
                  <h4 className="font-medium text-base mb-3 text-green-400">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
