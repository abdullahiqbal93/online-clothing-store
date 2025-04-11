import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, Home } from 'lucide-react';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center relative overflow-hidden">
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
          }
          .animate-fall {
            animation: fall linear forwards;
          }
        `}
      </style>
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                backgroundColor: ['#6B7280', '#9CA3AF', '#D1D5DB'][Math.floor(Math.random() * 3)], 
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <div className="h-32 bg-gray-50 flex items-center justify-center relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 text-3xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Order Confirmed
          </h1>
          <p className="text-gray-600 text-sm mb-6">Your items will be shipped soon.</p>

          <div className="relative mb-6">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 transform -translate-y-1/2"></div>
            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white mb-1">✓</div>
                <span className="text-xs text-gray-500">Payment</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white mb-1">✓</div>
                <span className="text-xs text-gray-500">Confirmed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white mb-1">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-xs text-gray-500">Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-1">
                  <Home className="h-4 w-4" />
                </div>
                <span className="text-xs text-gray-500">Delivered</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              onClick={() => navigate("/shop/profile")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Order
            </Button>
            <Button
              variant="outline"
              className="w-full py-4 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              onClick={() => navigate("/shop/listing")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;