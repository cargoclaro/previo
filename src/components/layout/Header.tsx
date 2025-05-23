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
        "sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b py-4 pl-5 pr-0 md:py-4 md:pl-5 md:pr-0 shadow-sm",
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
          {location.pathname === '/' ? (
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/dca130f5-7f04-4515-b0f0-b942b6a23c5a.png" 
                alt="Cargo Claro" 
                className="h-8 md:h-9 w-auto object-contain"
              />
              <h1 className="text-lg md:text-xl font-medium text-gray-900">{title}</h1>
            </div>
          ) : (
            <h1 className="text-lg md:text-xl font-medium text-gray-900">{title}</h1>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
