import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, Bike, CheckCircle2, History, ChevronRight } from 'lucide-react';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        try {
            const res = await axios.get('/api/v1/orders/me');
            setOrders(res.data);
        } catch (err) {
            console.error("Tracking Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
        const interval = setInterval(fetchMyOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const getStatusStep = (status) => {
        const sequence = ['RECEIVED', 'KITCHEN', 'DISPATCHED', 'DELIVERED'];
        return sequence.indexOf(status);
    };

    const StatusTimeline = ({ status }) => {
        const steps = [
            { key: 'RECEIVED', label: 'Recebido', icon: <Package size={14} /> },
            { key: 'KITCHEN', label: 'Na Forneria', icon: <Clock size={14} /> },
            { key: 'DISPATCHED', label: 'Em Rota', icon: <Bike size={14} /> },
            { key: 'DELIVERED', label: 'Entregue', icon: <CheckCircle2 size={14} /> }
        ];

        const currentStep = getStatusStep(status);

        return (
            <div className="flex justify-between items-center w-full px-2 py-6">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center gap-2 group relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${idx <= currentStep
                                    ? 'bg-teal-accent text-navy-deep'
                                    : 'bg-navy-deep text-silver-muted border border-border-navy'
                                }`}>
                                {idx < currentStep ? <CheckCircle2 size={16} /> : step.icon}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest absolute -bottom-5 w-20 text-center ${idx === currentStep ? 'text-teal-accent' : 'text-silver-muted'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-[2px] mx-2 transition-all ${idx < currentStep ? 'bg-teal-accent' : 'bg-border-navy'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-teal-accent">Localizando seus pedidos...</div>;

    const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    const pastOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');

    return (
        <div className="space-y-12 animate-in fade-in duration-500 max-w-3xl mx-auto pb-20">
            <div>
                <h2 className="text-3xl font-black text-silver-crisp uppercase tracking-tighter">Status do Pedido</h2>
                <p className="text-silver-muted font-bold text-[10px] uppercase tracking-[0.3em]">Acompanhamento Real-time</p>
            </div>

            {/* Active Orders */}
            <div className="space-y-6">
                {activeOrders.map(order => (
                    <div key={order.id} className="bg-navy-dark/60 border border-border-navy rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="px-3 py-1 bg-teal-accent/10 border border-teal-accent/20 rounded-full text-[10px] font-black text-teal-accent uppercase animate-pulse">
                                Ao Vivo
                            </div>
                        </div>

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-xs font-black text-silver-muted uppercase tracking-widest">Pedido</span>
                                <h4 className="text-2xl font-mono font-black text-silver-crisp"># {order.id}</h4>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-silver-muted uppercase tracking-widest">Total</span>
                                <p className="text-xl font-black text-teal-accent">R$ {order.total_amount.toFixed(2)}</p>
                            </div>
                        </div>

                        <StatusTimeline status={order.status} />

                        <div className="mt-12 pt-8 border-t border-border-navy/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-navy-deep flex items-center justify-center text-teal-accent border border-border-navy">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-silver-crisp">{order.items?.length} itens em preparo</p>
                                    <p className="text-[10px] text-silver-muted uppercase">Daniel's Forneria • Matriz</p>
                                </div>
                            </div>
                            <button className="text-teal-accent font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                Ver Detalhes <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {activeOrders.length === 0 && (
                    <div className="py-20 border-2 border-dashed border-border-navy rounded-3xl flex flex-col items-center justify-center text-silver-muted space-y-4 opacity-40">
                        <Package size={48} />
                        <p className="font-black uppercase tracking-widest text-[10px]">Nenhum pedido ativo no momento</p>
                    </div>
                )}
            </div>

            {/* Past Orders */}
            {pastOrders.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-silver-muted flex items-center gap-2">
                        <History size={14} /> Histórico Recente
                    </h3>
                    <div className="grid gap-3">
                        {pastOrders.slice(0, 5).map(order => (
                            <div key={order.id} className="bg-navy-dark/40 border border-border-navy rounded-2xl p-4 flex justify-between items-center hover:bg-navy-dark/60 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-navy-deep flex items-center justify-center text-silver-muted border border-border-navy">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-silver-crisp">Pedido #{order.id}</p>
                                        <p className="text-[10px] text-silver-muted uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-silver-muted">R$ {order.total_amount.toFixed(2)}</p>
                                    <span className="text-[9px] font-black uppercase text-teal-accent/50">Concluído</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
