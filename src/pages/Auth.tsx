import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageTransition from '@/components/layout/PageTransition';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import { toast } from 'sonner';
import { Mail, Lock, User, Building } from 'lucide-react';
const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');

  // Handle sign in with email
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up with email
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            organization: organization || email
          }
        }
      });
      if (error) throw error;
      toast.success('Registro exitoso. Verifica tu email para confirmar tu cuenta.');
      setIsLogin(true);
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };
  return <PageTransition>
      <div className="min-h-screen flex flex-col bg-orange-50">
        {/* Added logo and name at the top left */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/5fb656fd-06e2-44f8-9b8b-343ebe591e4b.png" alt="Cargo Claro" className="h-8" onError={e => {
            e.currentTarget.src = 'https://via.placeholder.com/120x30?text=Cargo+Claro';
          }} />
            <h2 className="text-xl font-bold text-orange-600">Cargo Claro</h2>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-orange-600">Previo</h1>
              <p className="mt-2 text-gray-600">
                {isLogin ? 'Inicia sesión para continuar' : 'Regístrate para comenzar'}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
                  </div>
                  
                  {!isLogin && <>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} className="pl-10" required />
                      </div>
                      
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} className="pl-10" required />
                      </div>
                      
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="Organización (opcional)" value={organization} onChange={e => setOrganization(e.target.value)} className="pl-10" />
                      </div>
                    </>}
                </div>
                
                <Button className="w-full py-3 bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                  {isLoading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-orange-600 hover:underline">
                  {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>;
};
export default Auth;