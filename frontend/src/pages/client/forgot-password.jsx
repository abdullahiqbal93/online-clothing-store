import { useState } from 'react';
import { useRequestPasswordResetMutation } from '@/lib/store/api/userService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestPasswordReset, { isLoading, error }] = useRequestPasswordResetMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setRequestSent(true);
    } catch (err) {
      toast.error('Failed to request password reset:', err?.data?.message || err.message || err.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestSent ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                If your email is registered with us, you will receive password reset instructions shortly.
                Please check your email inbox and follow the instructions to reset your password.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-600">
                      {error.data?.message || 'An error occurred. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft size={16} />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;