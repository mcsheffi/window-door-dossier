import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate("/app");
    }
  }, [session, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/app");
      } else if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        navigate("/login");
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Please check your email for password reset instructions.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-700/50">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0066FF',
                    brandAccent: '#0052CC',
                    inputBackground: 'rgb(17 24 39)',
                    inputText: 'white',
                    inputPlaceholder: 'rgb(156 163 175)',
                    inputBorder: 'rgb(75 85 99)',
                    inputBorderHover: 'rgb(107 114 128)',
                    inputBorderFocus: '#0066FF',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-2',
                input: 'w-full bg-gray-900 text-white border border-gray-700 rounded-md px-4 py-2',
                label: 'text-sm font-medium text-gray-300',
                message: 'text-sm text-red-500',
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;