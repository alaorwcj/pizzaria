import React, { useState, useEffect } from 'react';
import Catalog from './views/Catalog';
import Checkout from './views/Checkout';
import KDS from './views/KDS';
import Login from './views/Login';
import Register from './views/Register';
import CourierView from './views/CourierView';
import OrderTracking from './views/OrderTracking';
import CartSidebar from './components/CartSidebar';
import { useAuth } from './store/useAuth';
import { User, LogOut, ShieldCheck, Bike, ClipboardList } from 'lucide-react';

const App = () => {
    const [view, setView] = useState('catalog');
    const { isAuthenticated, user, logout, initAuth } = useAuth();

    useEffect(() => {
        initAuth();
    }, []);

    // Navigation guards
    const handleCheckoutAccess = () => {
        if (!isAuthenticated) setView('login');
        else setView('checkout');
    };

    const handleKDSAccess = () => {
        if (!isAuthenticated) setView('login');
        else setView('kds');
    };

    const handleCourierAccess = () => {
        if (!isAuthenticated) setView('login');
        else setView('courier');
    };

    const handleTrackingAccess = () => {
        if (!isAuthenticated) setView('login');
        else setView('tracking');
    };

    const renderContent = () => {
        switch (view) {
            case 'catalog': return <Catalog />;
            case 'checkout': return isAuthenticated ? <Checkout onBack={() => setView('catalog')} /> : <Login onSuccess={() => setView('checkout')} onRegister={() => setView('register')} />;
            case 'kds': return isAuthenticated ? <KDS /> : <Login onSuccess={() => setView('kds')} onRegister={() => setView('register')} />;
            case 'courier': return isAuthenticated ? <CourierView /> : <Login onSuccess={() => setView('courier')} onRegister={() => setView('register')} />;
            case 'tracking': return isAuthenticated ? <OrderTracking /> : <Login onSuccess={() => setView('tracking')} onRegister={() => setView('register')} />;
            case 'login': return <Login onSuccess={() => setView('catalog')} onRegister={() => setView('register')} />;
            case 'register': return <Register onSuccess={() => setView('login')} onLogin={() => setView('login')} />;
            default: return <Catalog />;
        }
    };

    return (
        <div className="min-h-screen bg-navy-deep flex text-silver-crisp font-['Public_Sans']">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-border-navy flex items-center justify-between px-10 bg-navy-dark/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-accent rounded-lg flex items-center justify-center cursor-pointer shadow-lg shadow-teal-accent/20" onClick={() => setView('catalog')}>
                            <span className="text-navy-deep font-black text-xl italic">D</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">DANIEL'S FORNERIA</h1>
                            <p className="text-[10px] text-teal-accent font-bold tracking-[0.2em] uppercase leading-none">
                                {isAuthenticated ? `User: ${user.name}` : 'Ecosystem'} •
                                {view === 'catalog' ? ' Digital Catalog' :
                                    view === 'checkout' ? ' Secure Checkout' :
                                        view === 'kds' ? ' Ops Monitor' :
                                            view === 'courier' ? ' Logistics hub' :
                                                view === 'tracking' ? ' Tracking' : ' Identity'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.15em] text-silver-muted items-center">
                            <button onClick={() => setView('catalog')} className={`${view === 'catalog' ? 'text-teal-accent' : 'hover:text-silver-crisp'} transition-all`}>Cardápio</button>

                            <button onClick={handleTrackingAccess} className={`${view === 'tracking' ? 'text-teal-accent' : 'hover:text-silver-crisp'} flex items-center gap-2 transition-all`}>
                                <ClipboardList className="h-3 w-3" />
                                Meus Pedidos
                            </button>

                            <div className="flex items-center gap-4 pl-4 border-l border-border-navy">
                                <button onClick={handleKDSAccess} className={`${view === 'kds' ? 'text-teal-accent' : 'hover:text-silver-crisp'} flex items-center gap-2 transition-all`}>
                                    <ShieldCheck className="h-3 w-3" />
                                    Cozinha
                                </button>
                                <button onClick={handleCourierAccess} className={`${view === 'courier' ? 'text-teal-accent' : 'hover:text-silver-crisp'} flex items-center gap-2 transition-all`}>
                                    <Bike className="h-3 w-3" />
                                    Logística
                                </button>
                            </div>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-6 pl-6 border-l border-border-navy">
                                    <div className="flex flex-col items-end">
                                        <span className="text-silver-crisp text-[9px] font-mono">{user.role}</span>
                                        <button onClick={logout} className="text-red-400 hover:text-red-300 text-[8px] flex items-center gap-1 mt-1 transition-colors font-black">
                                            <LogOut className="h-2 w-2" /> EXIT
                                        </button>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-teal-accent/30 flex items-center justify-center text-teal-accent">
                                        <User className="h-4 w-4" />
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setView('login')} className="bg-teal-accent/10 border border-teal-accent/30 text-teal-accent px-4 py-2 rounded-lg hover:bg-teal-accent/20 transition-all font-black">
                                    LOGIN
                                </button>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-950/20">
                    <div className="max-w-6xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* Cart Section */}
            <CartSidebar onCheckout={handleCheckoutAccess} isVisible={view === 'catalog'} />
        </div>
    );
};

export default App;
