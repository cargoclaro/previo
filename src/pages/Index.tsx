
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
  return <Card onClick={onClick} className="hover:translate-y-[-2px] transition-transform duration-300">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cargo-orange/10 rounded-full text-cargo-orange">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>;
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
      <div className="flex flex-col min-h-screen bg-cargo-light">
        <Header title="Cargo Claro" />
        
        <main className="flex-1 px-4 py-6 container max-w-md mx-auto">
          {user ? (
            <section className="space-y-6 animate-slide-up">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-medium tracking-tight">Dashboard de Previos</h2>
                  <p className="text-muted-foreground">Selecciona una opción para comenzar</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
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
            </section>
          ) : (
            <section className="space-y-6 animate-slide-up text-center">
              <div className="p-8 bg-orange-100 rounded-full w-24 h-24 mx-auto">
                <User size={48} className="text-orange-600 mx-auto mt-2" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-medium tracking-tight">Bienvenido a Cargo Claro</h2>
                <p className="text-muted-foreground">Inicia sesión para acceder a tu cuenta</p>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md shadow-sm"
                >
                  Iniciar Sesión
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
