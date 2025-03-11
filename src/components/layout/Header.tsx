
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4 px-6",
        className
      )}
    >
      <div className="flex items-center">
        {showBackButton && location.pathname !== '/' && (
          <button 
            onClick={handleBack}
            className="mr-3 rounded-full p-1 hover:bg-secondary transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
