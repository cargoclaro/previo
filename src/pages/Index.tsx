
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import PageTransition from '@/components/layout/PageTransition';
import { ClipboardList, FileText, FlaskConical } from 'lucide-react';

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
        <div className="p-3 bg-primary/10 rounded-full text-primary">
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
  const projects = [{
    id: 'new-previo',
    title: 'Registro de nuevo Previo',
    icon: <FileText size={24} />,
    description: 'Registra un nuevo proceso de previo para importaciones',
    path: '/register-previo'
  }, {
    id: 'realizar-previo',
    title: 'Realizar Previo',
    icon: <ClipboardList size={24} />,
    description: 'Continuar con un proceso de previo existente',
    path: '/pedimento-selection'
  }, {
    id: 'test-productos',
    title: 'Test - Productos',
    icon: <FlaskConical size={24} />,
    description: 'Prueba de registro y verificación de productos',
    path: '/product-verification'
  }];
  
  // Check if there are saved products
  const hasSavedWork = localStorage.getItem('savedProducts') !== null;
  
  return <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="PrevioApp" />
        
        <main className="flex-1 px-4 py-6 container max-w-md mx-auto">
          <section className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium tracking-tight">Proyectos Compartidos</h2>
              <p className="text-muted-foreground">Selecciona un proyecto para comenzar a trabajar</p>
            </div>
            
            <div className="grid gap-4">
              {projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  title={project.title} 
                  icon={project.icon} 
                  description={
                    project.id === 'realizar-previo' && hasSavedWork 
                      ? 'Continuar con un proceso de previo guardado' 
                      : project.description
                  }
                  onClick={() => navigate(project.path)} 
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageTransition>;
};

export default Index;
