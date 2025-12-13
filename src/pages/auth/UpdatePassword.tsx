import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { updatePasswordSchema, UpdatePasswordFormData } from "@/lib/validations/auth";


/**
 *
 */
export default function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    // Check if we have a valid session for password update
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Invalid or expired password reset link. Please request a new one.");
        setIsVerifying(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Invalid or expired password reset link. Please request a new one.");
        setIsVerifying(false);
        return;
      }

      setIsVerifying(false);
    };

    // Give Supabase a moment to process the token from the URL
    const timer = setTimeout(checkSession, 500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({ 
      password: data.password 
    });

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    setIsSuccess(true);
    toast({
      title: "Password updated!",
      description: "Redirecting to login...",
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/20 p-4">
        <Card className="relative w-full max-w-md glass-effect-strong shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-card-foreground">Verifying Link</h1>
            <CardDescription>Please wait while we verify your reset link...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Spinner className="h-12 w-12 text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/20 p-4">
        <Card className="relative w-full max-w-md glass-effect-strong shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-card-foreground">Link Expired</h1>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => navigate("/forgot-password")}
            >
              Request New Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/20 p-4">
        <Card className="relative w-full max-w-md glass-effect-strong shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-success text-success-foreground shadow-lg">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Password Updated!</h1>
              <CardDescription>Redirecting to login...</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Spinner className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/20 p-4">
      {/* Background decorations */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-info/10 blur-3xl" />

      <Card className="relative w-full max-w-md glass-effect-strong shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Update Password</h1>
            <CardDescription>Enter your new password</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
