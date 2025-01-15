import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

interface PageHeaderProps {
  isEditing: boolean;
  onSignOut: () => void;
}

const PageHeader = ({ isEditing, onSignOut }: PageHeaderProps) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center mb-8">
      <img
        src={theme === 'dark' 
          ? "/lovable-uploads/5ec936a7-e291-40bc-a9f1-992a30344788.png"
          : "/lovable-uploads/ebeb244c-2956-4120-8334-dc0a4488607b.png"
        }
        alt="Bradley Building Products Logo"
        className="h-24 mb-6"
      />
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Quote" : "Window & Door Configurator"}
        </h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link to="/">Dashboard</Link>
          </Button>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;