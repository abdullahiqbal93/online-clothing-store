import React from 'react';
import { ShoppingCart, CreditCard, PackageCheck, Truck } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Curate Your Style",
      description: "Explore our chic collection and select your perfect pieces",
      color: "bg-violet-50",
      accent: "text-violet-600",
      shadow: "shadow-violet-200/50"
    },
    {
      icon: CreditCard,
      title: "Seamless Checkout",
      description: "Securely purchase your wardrobe with ease",
      color: "bg-emerald-50",
      accent: "text-emerald-600",
      shadow: "shadow-emerald-200/50"
    },
    {
      icon: PackageCheck,
      title: "Tailored Packing",
      description: "We fold and pack your fashion finds with care",
      color: "bg-blue-50",
      accent: "text-blue-600",
      shadow: "shadow-blue-200/50"
    },
    {
      icon: Truck,
      title: "Runway Delivery",
      description: "Your new look arrives swiftly at your door",
      color: "bg-amber-50",
      accent: "text-amber-600",
      shadow: "shadow-amber-200/50"
    }
  ];

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" fill="none">
          <path
            d="M0 200 Q 300 100, 600 200 T 1200 200 T 1800 200"
            stroke="url(#threadGradient)"
            strokeWidth="2"
            className="animate-wave"
          />
          <defs>
            <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#c4b5fd' }} /> 
              <stop offset="100%" style={{ stopColor: '#6ee7b7' }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="mt-2 text-4xl font-bold text-foreground">How It Threads</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From browsing to wearing, your style story unfolds
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-300 to-emerald-300 -translate-x-1/2"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center mb-12 relative ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`${step.color} w-80 p-6 rounded-2xl ${step.shadow} transform transition-all duration-500 hover:-translate-y-2 hover:rotate-3 hover:shadow-xl`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0 mr-4 shadow-md`}>
                    <step.icon size={24} className={step.accent} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${step.accent}`}>{step.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              </div>

              <div className="w-16 flex items-center justify-center relative z-10">
                <div className="w-8 h-8 bg-background rounded-full border-2 border-border flex items-center justify-center font-bold text-foreground shadow-md">
                  {index + 1}
                </div>
                <div className={`absolute h-px w-8 bg-border ${index % 2 === 0 ? 'left-0' : 'right-0'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;