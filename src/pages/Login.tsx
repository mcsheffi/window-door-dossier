import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <img
            src={theme === 'dark' 
              ? "/lovable-uploads/5ec936a7-e291-40bc-a9f1-992a30344788.png"
              : "/lovable-uploads/ebeb244c-2956-4120-8334-dc0a4488607b.png"
            }
            alt="Bradley Building Products Logo"
            className="h-24 mb-4"
          />
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-xl border border-border">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={theme === 'dark' ? 'dark' : 'light'}
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;