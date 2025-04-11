import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

function PaymentFailedPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center relative overflow-hidden">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <div className="h-32 bg-red-50 flex items-center justify-center relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            We couldn't process your payment. Please try again or use a different payment method.
          </p>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error details</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Your card was declined. Please check your card details or contact your bank.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              onClick={() => navigate("/shop/checkout")}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              variant="ghost"
              className="w-full py-4 text-gray-500 font-medium rounded-lg hover:bg-gray-50"
              onClick={() => navigate("/shop/home")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaymentFailedPage;