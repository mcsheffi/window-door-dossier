import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <img
        src="/lovable-uploads/ebeb244c-2956-4120-8334-dc0a4488607b.png"
        alt="Bradley Building Products Logo"
        className="h-24 mb-6"
      />
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/quote">New Quote</Link>
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;