import React, { useState } from 'react';
import { useAuth } from '../store/useAuth';
import { UserPlus, Mail, Lock, Phone, User, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = ({ onLogin, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_whatsapp: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const register = useAuth(state => state.register);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao realizar cadastro. Tente outro email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 scale-95 origin-center">
            <div className="max-w-md w-full space-y-8 bg-navy-dark/40 p-10 rounded-2xl border border-border-navy backdrop-blur-xl shadow-2xl shadow-navy-deep/50">
                <div>
                    <div className="mx-auto h-12 w-12 bg-teal-accent rounded-xl flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-navy-deep" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-silver-crisp">
                        New Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-silver-muted tracking-wide">
                        Cadastre-se para aproveitar o melhor de nossa Forneria
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-silver-muted group-focus-within:text-teal-accent transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="appearance-none relative block w-full pl-10 px-3 py-3 border border-border-navy bg-navy-deep/50 placeholder-silver-muted text-silver-crisp rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent sm:text-sm transition-all"
                                placeholder="FullName"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-silver-muted group-focus-within:text-teal-accent transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="appearance-none relative block w-full pl-10 px-3 py-3 border border-border-navy bg-navy-deep/50 placeholder-silver-muted text-silver-crisp rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent sm:text-sm transition-all"
                                placeholder="Corporate Email"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-silver-muted group-focus-within:text-teal-accent transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.phone_whatsapp}
                                onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })}
                                className="appearance-none relative block w-full pl-10 px-3 py-3 border border-border-navy bg-navy-deep/50 placeholder-silver-muted text-silver-crisp rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent sm:text-sm transition-all"
                                placeholder="WhatsApp (e.g. +55 11...)"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-silver-muted group-focus-within:text-teal-accent transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="appearance-none relative block w-full pl-10 px-3 py-3 border border-border-navy bg-navy-deep/50 placeholder-silver-muted text-silver-crisp rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent sm:text-sm transition-all"
                                placeholder="Secure Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-semibold">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-navy-deep bg-teal-accent hover:bg-teal-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent transition-all shadow-lg shadow-teal-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-navy-deep border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Complete Registration"
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onLogin}
                            className="text-xs font-semibold text-silver-muted hover:text-teal-accent transition-colors uppercase tracking-widest"
                        >
                            Already have an account? Go to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
