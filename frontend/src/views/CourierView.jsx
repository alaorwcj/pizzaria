import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bike, CheckCircle, Navigation, MapPin, Clock, Loader2 } from 'lucide-react';

const CourierView = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [courierProfile, setCourierProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [deliveriesRes, profileRes] = await Promise.all([
                axios.get('/api/v1/couriers/my-deliveries'),
                axios.get('/api/v1/couriers/me').catch(e => ({ data: null }))
            ]);
            setDeliveries(deliveriesRes.data);
            setCourierProfile(profileRes.data);
        } catch (err) {
            console.error("Courier Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const completeDelivery = async (orderId) => {
        try {
            await axios.patch(`/api/v1/orders/${orderId}/status?status=DELIVERED`);
            fetchData();
        } catch (err) {
            alert("Erro ao finalizar entrega");
        }
    };

    const toggleOnline = async (online) => {
        try {
            if (!courierProfile) {
                if (window.confirm("Você não está registrado como entregador. Deseja se registrar agora?")) {
                    await axios.post('/api/v1/couriers/register', { vehicle_type: 'MOTO', is_online: true });
                    fetchData();
                }
                return;
            }
            await axios.patch('/api/v1/couriers/status', { is_online: online });
            fetchData();
        } catch (err) {
            console.error("Toggle failed", err);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-teal-accent">Acessando Painel Logístico...</div>;

    const isOnline = courierProfile?.is_online || false;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto pb-20">
            <header className="flex justify-between items-center bg-navy-dark/40 p-8 rounded-3xl border border-border-navy shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-teal-accent"></div>
                <div>
                    <h2 className="text-2xl font-black text-silver-crisp uppercase tracking-tighter italic">Logistics Hub</h2>
                    <p className="text-teal-accent font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Courier Partner Portal</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => toggleOnline(!isOnline)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isOnline
                                ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                                : 'bg-teal-accent/10 border-teal-accent/30 text-teal-accent hover:bg-teal-accent/20 animate-pulse'
                            }`}
                    >
                        {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                    </button>
                </div>
            </header>

            {!isOnline && (
                <div className="bg-amber-500/10 border-2 border-amber-500/20 p-8 rounded-3xl text-center space-y-3">
                    <Bike className="mx-auto text-amber-500" size={40} />
                    <h3 className="text-silver-crisp font-black uppercase tracking-tight">Você está Offline</h3>
                    <p className="text-silver-muted text-xs font-semibold px-10">Fique online para receber novos pedidos e iniciar suas entregas.</p>
                </div>
            )}

            {isOnline && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-silver-muted">Entregas Ativas ({deliveries.filter(d => d.status === 'DISPATCHED').length})</h3>
                        <span className="text-[9px] font-mono text-teal-accent/50 animate-pulse">Monitorando pulso...</span>
                    </div>

                    <div className="grid gap-4">
                        {deliveries.filter(d => d.status === 'DISPATCHED').map(order => (
                            <div key={order.id} className="bg-navy-dark border border-teal-accent/30 rounded-3xl p-8 shadow-2xl space-y-8 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[9px] font-black text-amber-500 uppercase">
                                        Em Rota
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-teal-accent/10 rounded-2xl flex items-center justify-center text-teal-accent border border-teal-accent/20">
                                        <Bike size={28} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-silver-muted uppercase tracking-widest leading-none">Entrega Expressa</span>
                                        <h4 className="text-2xl font-mono font-black text-teal-accent">#ORD-{order.id}</h4>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border-navy/50">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-silver-muted">
                                            <MapPin size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Destino</span>
                                        </div>
                                        <p className="text-sm font-bold text-silver-crisp">Address ID: {order.address_id}</p>
                                        <p className="text-[9px] text-silver-muted font-bold uppercase italic">Coordenadas Ativas via GPS</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-silver-muted">
                                            <Clock size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Tempo Decorrido</span>
                                        </div>
                                        <p className="text-sm font-bold text-teal-accent italic">Despachado há {Math.floor((Date.now() - new Date(order.created_at)) / 60000)} mins</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => completeDelivery(order.id)}
                                    className="w-full bg-teal-accent hover:bg-teal-light text-navy-deep font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-[0.98]"
                                >
                                    Confirmar Entrega <CheckCircle size={22} />
                                </button>
                            </div>
                        ))}

                        {deliveries.filter(d => d.status === 'DISPATCHED').length === 0 && (
                            <div className="py-24 border-2 border-dashed border-border-navy rounded-3xl flex flex-col items-center justify-center text-silver-muted space-y-6 opacity-30">
                                <Navigation className="animate-bounce" size={48} />
                                <div className="text-center">
                                    <p className="font-black uppercase tracking-[0.3em] text-[11px]">Varrendo pedidos...</p>
                                    <p className="text-[9px] font-bold uppercase mt-2">Sua localização está visível para a central</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourierView;
