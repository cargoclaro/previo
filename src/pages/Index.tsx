import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import PageTransition from '@/components/layout/PageTransition';
import { ClipboardList, FileText, History, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  icon,
  description,
  onClick
}) => {
  return (
    <Card 
      onClick={onClick} 
      className="hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-3 bg-gradient-to-br from-cargo-orange/20 to-cargo-orange/10 rounded-full text-cargo-orange">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base md:text-lg text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
    </Card>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };
  
  const projects = [
    {
      id: 'new-previo',
      title: 'Nuevo Previo',
      icon: <FileText size={24} />,
      description: 'Registra un nuevo proceso de previo para importaciones',
      path: '/register-previo'
    }, 
    {
      id: 'continue-previo',
      title: 'Continuar Previo',
      icon: <ClipboardList size={24} />,
      description: 'Continuar con un proceso de previo en progreso',
      path: '/pedimento-selection'
    },
    {
      id: 'history',
      title: 'Historial de Previos',
      icon: <History size={24} />,
      description: 'Ver todos los previos completados',
      path: '/previos-history'
    }
  ];
  
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-cargo-light to-white">
        <Header title="Cargo Claro" />
        
        <main className="flex-1 container max-w-md mx-auto flex flex-col py-6 px-4">
          {user ? (
            <section className="flex-1 flex flex-col space-y-6 animate-slide-up">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900">
                  Dashboard de Previos
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Selecciona una opción para comenzar
                </p>
              </div>
              
              <div className="grid gap-4">
                {projects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    title={project.title} 
                    icon={project.icon} 
                    description={project.description}
                    onClick={() => navigate(project.path)}
                  />
                ))}
              </div>
              
              <div className="mt-auto pt-6">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 
                    text-gray-700 font-medium p-3 rounded-lg transition-all duration-200"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </section>
          ) : (
            <section className="space-y-12 animate-slide-up text-center py-16">
              {/* Hero image and gradient overlay */}
              <div className="relative aspect-square w-full max-w-sm mb-8 rounded-2xl overflow-hidden mx-auto">
                <img 
                  src="/lovable-uploads/woker.jpg" 
                  alt="Cargo worker checking information" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent"></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  <span className="text-cargo-orange">Previo App</span>
                  <span className="block text-sm font-normal text-gray-500">by Cargo Claro</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Gestiona tus procesos de importación de manera eficiente, asistencia a la glosa aduanal.
                </p>
              </div>
              
              <div>
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-cargo-orange to-orange-500 hover:from-cargo-orange/90 
                    hover:to-orange-500/90 active:scale-[0.98] text-white px-8 py-4 rounded-xl 
                    shadow-lg shadow-orange-500/20 transition-all duration-200 font-medium text-lg
                    hover:shadow-xl hover:shadow-orange-500/30"
                >
                  Comenzar
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default Index;
