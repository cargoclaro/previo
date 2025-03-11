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
        "sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-cargo-gray py-4 px-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && location.pathname !== '/' && (
            <button 
              onClick={handleBack}
              className="mr-3 rounded-full p-1 hover:bg-cargo-gray transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        
        <div className="flex items-center">
          {location.pathname === '/' && (
            <img 
              src="/lovable-uploads/5fb656fd-06e2-44f8-9b8b-343ebe591e4b.png" 
              alt="Cargo Claro" 
              className="h-8"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/120x30?text=Cargo+Claro';
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
