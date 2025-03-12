
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
        <div className="flex items-center gap-3">
          {showBackButton && location.pathname !== '/' && (
            <button 
              onClick={handleBack}
              className="rounded-full p-1 hover:bg-cargo-gray transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        
        {location.pathname === '/' && (
          <img 
            src="/lovable-uploads/dca130f5-7f04-4515-b0f0-b942b6a23c5a.png" 
            alt="Cargo Claro" 
            className="h-8 w-auto object-contain"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
