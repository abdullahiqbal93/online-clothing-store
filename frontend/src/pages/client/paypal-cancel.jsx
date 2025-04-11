import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

function PaypalCancelPage() {
  const navigate = useNavigate();

  const handleReturn = () => {
    sessionStorage.removeItem("currentOrderId");
    navigate('/shop/checkout');
  };

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="relative border-destructive/30 bg-background shadow-sm">
          <CardHeader className="space-y-6 p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto text-destructive"
            >
              <XCircle className="h-16 w-16" />
            </motion.div>

            <div className="space-y-3 text-center">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Payment Cancelled
              </CardTitle>
              <p className="text-muted-foreground">
                Transaction was not completed. You can safely return to checkout.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="w-full mt-4"
                onClick={handleReturn}
              >
                Return to Checkout
              </Button>
            </motion.div>
          </CardHeader>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span>Secure encrypted transaction</span>
        </div>
      </motion.div>
    </div>
  );
}

export default PaypalCancelPage;