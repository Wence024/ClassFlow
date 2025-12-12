import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 *
 */
export default function VerifyEmail() {
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const email = location.state?.email;

  useEffect(() => {
    // Listen for auth state changes to detect email verification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
          const emailConfirmedAt = session.user.email_confirmed_at;
          
          if (emailConfirmedAt) {
            toast({
              title: "Email verified!",
              description: "Redirecting to dashboard...",
            });
            navigate("/dashboard", { replace: true });
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No email address found. Please go back to register.",
      });
      return;
    }

    setIsResending(true);
    
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    setIsResending(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Email sent!",
      description: "Please check your inbox for the verification link.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/20 p-4">
      {/* Background decorations */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-info/10 blur-3xl" />

      <Card className="relative w-full max-w-md glass-effect-strong shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Mail className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Verify Your Email</h1>
            <CardDescription>
              We've sent a verification link to your email
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
            </div>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to continue.
              {email && (
                <span className="mt-2 block font-medium text-foreground">{email}</span>
              )}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
