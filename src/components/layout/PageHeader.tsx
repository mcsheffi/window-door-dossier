import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  isEditing: boolean;
  onSignOut: () => void;
}

const PageHeader = ({ isEditing, onSignOut }: PageHeaderProps) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <img
        src="/lovable-uploads/ebeb244c-2956-4120-8334-dc0a4488607b.png"
        alt="Bradley Building Products Logo"
        className="h-24 mb-6"
      />
      <div className="w-full flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-white">
          {isEditing ? "Edit Quote" : "Window & Door Configurator"}
        </h1>
        <div className="flex items-center space-x-4">
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