import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useValidateResetTokenMutation, useResetPasswordMutation } from '@/lib/store/api/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [validateToken, { isLoading: isValidating, error: validationError }] = useValidateResetTokenMutation();
  const [resetPassword, { isLoading: isResetting, error: resetError }] = useResetPasswordMutation();

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          await validateToken(token);
          setTokenValid(true);
        } catch (err) {
          setTokenValid(false);
          console.error('Token validation failed:', err);
        } finally {
          setTokenChecked(true);
        }
      }
    };

    checkToken();
  }, [token, validateToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setPasswordError('');
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password);
    
    if (password.length < 6 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setPasswordError(
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character'
      );
      return;
    }
    
    try {
      await resetPassword({ token, password }).unwrap();
      setResetSuccess(true);
      toast.success('Password reset successful!');
    } catch (err) {
      toast.error('Password reset failed:', err.message);
    }
  };

  if (!tokenChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-center">Validating your reset token...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid && tokenChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Invalid or Expired Link</CardTitle>
            <CardDescription className="text-center">
              The password reset link is invalid or has expired. Please request a new password reset link.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/forgot-password')}>
              Request New Reset Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully reset. You can now log in with your new password.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {passwordError && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-600">
                    {passwordError}
                  </AlertDescription>
                </Alert>
              )}
              
              {(validationError || resetError) && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-600">
                    {validationError?.data?.message || resetError?.data?.message || 'An error occurred. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={isResetting}>
                {isResetting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
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

export default ResetPassword;