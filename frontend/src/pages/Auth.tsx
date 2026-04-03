import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import api from '../lib/axios';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        setAuth(data.user, data.token);
        toast.success(`Welcome back, ${data.user.firstName}!`);
        if (data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const { data } = await api.post('/auth/register', {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        });
        setAuth(data.user, data.token);
        toast.success('Account created! Welcome to Scanty\'s Closet.');
        navigate('/');
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error ?? 'Something went wrong.' : 'Something went wrong.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-xl space-y-12">
        {/* Toggle */}
        <div className="flex items-center justify-center space-x-8 border-b border-white/5 pb-8">
           <button 
             onClick={() => setIsLogin(true)}
             className={`text-2xl font-black uppercase italic tracking-tighter transition-all 
               ${isLogin ? 'text-brand-red scale-110' : 'text-brand-silver/20 hover:text-brand-silver/50'}`}
           >
             Login
           </button>
           <button 
             onClick={() => setIsLogin(false)}
             className={`text-2xl font-black uppercase italic tracking-tighter transition-all 
               ${!isLogin ? 'text-brand-red scale-110' : 'text-brand-silver/20 hover:text-brand-silver/50'}`}
           >
             Register
           </button>
        </div>

        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-12 space-y-8 backdrop-blur-xl relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-2 bg-brand-red" />
           
           <div className="space-y-2">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">
                {isLogin ? "Welcome Back." : "Join The Closet."}
              </h2>
              <p className="text-brand-silver/50 font-medium text-sm">
                {isLogin 
                  ? "Enter your credentials to access your premium collection." 
                  : "Create an account to start your journey with Scanty's Closet."}
              </p>
           </div>

           <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                   <Input label="First Name" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required />
                   <Input label="Last Name" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
                </div>
              )}
              <Input label="Email Address" name="email" type="email" placeholder="john.doe@email.com" value={form.email} onChange={handleChange} required />
              <Input label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              
              <Button 
                type="submit" 
                size="lg" 
                isLoading={loading}
                className="w-full h-16 rounded-2xl text-lg font-black uppercase italic tracking-tight group"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
           </form>

           <div className="flex items-center justify-center space-x-3 pt-4 text-brand-silver/20">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Secure Authentication Powered By JWT</span>
           </div>
        </motion.div>

        {isLogin && (
          <p className="text-center text-[10px] font-bold text-brand-silver/30 uppercase tracking-[0.2em]">
            Forgot your password? <span className="text-brand-red hover:underline cursor-pointer">Reset it here</span>
          </p>
        )}
      </div>
    </div>
  );
}
