import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { capturePayment } from '@/lib/store/features/order/orderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('paymentId');
  const payerId = params.get('PayerID');

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      if (orderId) {
        dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = '/shop/payment-success';
          } else {
            toast.error('Payment capture failed. Please contact support.');
            window.location.href = '/shop/payment-failed';
          }
        });
      } else {
        toast.error('Order information not found');
        window.location.href = '/shop/payment-failed';
      }
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden shadow-lg rounded-xl">
          <div className="absolute inset-0 h-1 bg-primary w-full" />
          <CardHeader className="space-y-6 pt-12 pb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="mx-auto"
            >
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-center text-foreground">
              Verifying Payment
            </CardTitle>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                We're confirming your transaction details
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Finalizing secure payment</span>
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Please keep this page open during processing</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Protected by secure encryption</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaypalReturnPage;