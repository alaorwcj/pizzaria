import React, { useState } from 'react';
import { useAuth } from '../store/useAuth';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = ({ onRegister, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuth(state => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            onSuccess?.();
        } catch (err) {
            setError('Credenciais inválidas. Verifique seu email e senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 scale-95 origin-center">
            <div className="max-w-md w-full space-y-8 bg-navy-dark/40 p-10 rounded-2xl border border-border-navy backdrop-blur-xl shadow-2xl shadow-navy-deep/50">
                <div>
                    <div className="mx-auto h-12 w-12 bg-teal-accent rounded-xl flex items-center justify-center">
                        <LogIn className="h-6 w-6 text-navy-deep" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-silver-crisp">
                        Daniel's Forneria
                    </h2>
                    <p className="mt-2 text-center text-sm text-silver-muted tracking-wide">
                        Acesse sua conta para continuar
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-silver-muted group-focus-within:text-teal-accent transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full pl-10 px-3 py-3 border border-border-navy bg-navy-deep/50 placeholder-silver-muted text-silver-crisp rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent sm:text-sm transition-all"
                                placeholder="Email corporate"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-silver-muted group-focus-within:text-teal-accent transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full pl-10 px-3 py-3 border border-border-navy bg-navy-deep/50 placeholder-silver-muted text-silver-crisp rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent sm:text-sm transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-navy-deep bg-teal-accent hover:bg-teal-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent transition-all shadow-lg shadow-teal-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-navy-deep border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Login • Executive Access"
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onRegister}
                            className="text-xs font-semibold text-silver-muted hover:text-teal-accent transition-colors uppercase tracking-widest"
                        >
                            Don't have an account? Start Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
