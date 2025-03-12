
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
        "sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b py-3 px-4 md:py-4 md:px-6 shadow-sm",
        "border-cargo-gray/30",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3">
          {showBackButton && location.pathname !== '/' && (
            <button 
              onClick={handleBack}
              className="rounded-full p-2 hover:bg-cargo-gray/20 active:bg-cargo-gray/30 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <h1 className="text-lg md:text-xl font-medium text-gray-900">{title}</h1>
        </div>
        
        {location.pathname === '/' && (
          <img 
            src="/lovable-uploads/dca130f5-7f04-4515-b0f0-b942b6a23c5a.png" 
            alt="Cargo Claro" 
            className="h-7 md:h-8 w-auto object-contain"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
