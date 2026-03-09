import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, Bike, Check, Clock, AlertCircle, User } from 'lucide-react';

const KDS = () => {
    const [orders, setOrders] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourier, setSelectedCourier] = useState({});

    const fetchData = async () => {
        try {
            const [ordersRes, couriersRes] = await Promise.all([
                axios.get('/api/v1/orders/active'),
                axios.get('/api/v1/couriers/online')
            ]);
            setOrders(ordersRes.data);
            setCouriers(couriersRes.data);
        } catch (err) {
            console.error("KDS Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        const courierId = selectedCourier[orderId];
        if (newStatus === 'DISPATCHED' && !courierId) {
            alert("Selecione um entregador para despachar!");
            return;
        }

        try {
            let url = `/api/v1/orders/${orderId}/status?status=${newStatus}`;
            if (courierId) url += `&courier_id=${courierId}`;

            await axios.patch(url);
            fetchData();
        } catch (err) {
            alert("Erro ao atualizar status");
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Iniciando Monitor da Cozinha...</div>;

    const getStatusConfig = (status) => {
        switch (status) {
            case 'RECEIVED': return { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Novo Pedido', next: 'KITCHEN', nextLabel: 'Aceitar', icon: <AlertCircle size={16} /> };
            case 'KITCHEN': return { color: 'bg-teal-500/10 text-teal-500 border-teal-500/20', label: 'Em Preparo', next: 'DISPATCHED', nextLabel: 'Pronto / Despachar', icon: <ChefHat size={16} /> };
            case 'DISPATCHED': return { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', label: 'Em Rota', next: 'DELIVERED', nextLabel: 'Entregue', icon: <Bike size={16} /> };
            default: return { color: 'bg-graphite text-silver-muted', label: status };
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-silver-crisp uppercase tracking-tighter">Ops Monitor</h2>
                    <p className="text-silver-muted font-bold uppercase tracking-[0.3em] text-[10px]">Kitchen • Logistics • Real-time</p>
                </div>
                <div className="flex gap-4 text-xs font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-teal-accent"><span className="w-2 h-2 rounded-full bg-teal-accent animate-ping"></span> Live</span>
                    <span className="text-silver-muted">{orders.length} pedidos ativos</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {orders.map(order => {
                    const config = getStatusConfig(order.status);
                    return (
                        <div key={order.id} className="bg-navy-dark border border-border-navy rounded-2xl flex flex-col shadow-2xl overflow-hidden group hover:border-teal-accent/30 transition-all">
                            {/* Header Pedido */}
                            <div className={`p-4 border-b border-border-navy flex justify-between items-center ${config.color.split(' ')[0]}`}>
                                <span className="font-mono font-black text-lg">#{order.id}</span>
                                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${config.color}`}>
                                    {config.icon} {config.label}
                                </div>
                            </div>

                            {/* Itens */}
                            <div className="p-5 flex-1 space-y-4">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between gap-2">
                                            <span className="text-silver-crisp font-bold text-sm">{item.quantity}x Pizzaiolo ID {item.product_id}</span>
                                        </div>
                                        {item.observation && (
                                            <p className="text-[10px] bg-navy-deep p-2 rounded text-amber-500/80 italic border border-border-navy">OBS: {item.observation}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Logistics context */}
                            {order.status === 'KITCHEN' && (
                                <div className="px-5 pb-4">
                                    <label className="text-[9px] font-black uppercase text-silver-muted block mb-2 tracking-widest">Atribuir Entregador</label>
                                    <select
                                        className="w-full bg-navy-deep border border-border-navy rounded-lg p-2 text-xs text-silver-crisp outline-none focus:border-teal-accent transition-colors"
                                        onChange={(e) => setSelectedCourier({ ...selectedCourier, [order.id]: e.target.value })}
                                        value={selectedCourier[order.id] || ""}
                                    >
                                        <option value="">Selecione...</option>
                                        {couriers.map(c => (
                                            <option key={c.id} value={c.id}>{c.user?.name || `ID ${c.id}`} ({c.vehicle_type})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {order.courier_id && (
                                <div className="px-5 pb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-teal-accent/20 flex items-center justify-center text-teal-accent">
                                        <User size={12} />
                                    </div>
                                    <span className="text-[10px] font-bold text-teal-accent/80 uppercase">Rider Atribuído</span>
                                </div>
                            )}

                            {/* Footer / Ação */}
                            <div className="p-4 bg-navy-deep border-t border-border-navy mt-auto">
                                <div className="flex items-center gap-2 text-silver-muted text-[10px] font-bold mb-4 uppercase tracking-widest">
                                    <Clock size={12} /> {new Date(order.created_at).toLocaleTimeString()}
                                </div>
                                {config.next && (
                                    <button
                                        onClick={() => updateStatus(order.id, config.next)}
                                        className="w-full bg-teal-accent hover:bg-teal-light text-navy-deep font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                    >
                                        {config.nextLabel} <Check size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}

                {orders.length === 0 && (
                    <div className="col-span-full py-32 border-2 border-dashed border-border-navy rounded-3xl flex flex-col items-center justify-center text-silver-muted space-y-4 grayscale opacity-30">
                        <ChefHat size={64} />
                        <p className="font-black uppercase tracking-[0.2em]">Nenhum pedido na fila</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KDS;
