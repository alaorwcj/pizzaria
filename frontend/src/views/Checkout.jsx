import React, { useState, useEffect } from 'react';
import { useCart } from '../store/useCart';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../store/useAuth';

const Checkout = ({ onBack }) => {
    const { items, getTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetchingAddr, setFetchingAddr] = useState(true);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const user = useAuth(state => state.user);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('/api/v1/users/me/addresses');
            setAddresses(res.data);
            if (res.data.length > 0) {
                setSelectedAddressId(res.data[0].id);
            } else {
                // Auto-create a default for test users if none
                const defaultAddr = {
                    street: 'Av. Paulista, 1000',
                    city: 'São Paulo',
                    zip_code: '01310-100',
                    reference_point: 'Daniel\'s Partner Store',
                    lat: -23.550520,
                    lng: -46.633308
                };
                const newAddr = await axios.post('/api/v1/users/me/addresses', defaultAddr);
                setAddresses([newAddr.data]);
                setSelectedAddressId(newAddr.data.id);
            }
        } catch (err) {
            console.error("Failed to fetch address", err);
        } finally {
            setFetchingAddr(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const deliveryFee = 7.00;

    const handleFinalize = async () => {
        if (!selectedAddressId) {
            alert("Selecione um endereço");
            return;
        }
        setLoading(true);
        try {
            const orderPayload = {
                user_id: user?.id,
                address_id: selectedAddressId,
                total_amount: getTotal(),
                delivery_fee: deliveryFee,
                items: items.map(item => ({
                    product_id: item.product.id,
                    is_half_and_half: item.is_half_and_half || false,
                    flavor_2_id: item.flavor_2_id,
                    observation: item.observation || "",
                    quantity: item.quantity,
                    addons: (item.addons || []).map(a => ({
                        name: a.name,
                        extra_price: a.extra_price
                    }))
                }))
            };

            const response = await axios.post('/api/v1/orders/', orderPayload);
            setOrderSuccess(response.data);
            clearCart();
            setStep(3);
        } catch (err) {
            console.error("Order failed", err);
            alert("Erro ao processar pedido. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-teal-accent/20 rounded-full flex items-center justify-center shadow-2xl shadow-teal-accent/20">
                    <CheckCircle2 size={64} className="text-teal-accent" />
                </div>
                <h2 className="text-3xl font-black text-silver-crisp uppercase tracking-tighter">Pedido Confirmado!</h2>
                <div className="bg-navy-dark/40 border border-border-navy p-6 rounded-2xl">
                    <p className="text-silver-muted text-sm px-4">
                        Número <span className="text-teal-accent font-mono font-black">#{orderSuccess.id}</span>
                    </p>
                    <p className="text-[10px] text-silver-muted font-bold uppercase mt-2 tracking-widest">Acompanhe na aba "Meus Pedidos"</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-teal-accent text-navy-deep px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-teal-light transition-all shadow-lg"
                >
                    Voltar ao Início
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-500">
            <button onClick={onBack} className="flex items-center gap-2 text-silver-muted hover:text-teal-accent transition-colors font-black uppercase tracking-widest text-[10px]">
                <ArrowLeft size={14} /> Voltar ao Cardápio
            </button>

            <div className="space-y-4">
                <h2 className="text-4xl font-black text-silver-crisp uppercase tracking-tighter">Checkout</h2>
                <div className="flex gap-4">
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-teal-accent' : 'bg-navy-dark border border-border-navy'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-teal-accent' : 'bg-navy-dark border border-border-navy'}`}></div>
                </div>
            </div>

            {step === 1 && (
                <div className="bg-navy-dark border border-border-navy rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-border-navy bg-navy-deep/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-accent/10 rounded-2xl flex items-center justify-center text-teal-accent border border-teal-accent/20">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-silver-crisp uppercase tracking-tight">Onde entregamos?</h3>
                                <p className="text-xs text-silver-muted font-bold uppercase tracking-widest">Selecione seu endereço</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {fetchingAddr ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-accent" /></div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map(addr => (
                                    <button
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`w-full p-6 text-left rounded-2xl border-2 transition-all ${selectedAddressId === addr.id
                                            ? 'bg-teal-accent/10 border-teal-accent shadow-lg'
                                            : 'bg-navy-deep border-border-navy hover:border-silver-muted/30'
                                            }`}
                                    >
                                        <p className="text-silver-crisp font-bold">{addr.street}</p>
                                        <p className="text-silver-muted text-xs font-semibold">{addr.city} - {addr.zip_code}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setStep(2)}
                            disabled={!selectedAddressId}
                            className="w-full bg-teal-accent text-navy-deep font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-teal-accent/10 hover:bg-teal-light disabled:opacity-30 transition-all text-sm"
                        >
                            Próximo: Pagamento <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-navy-dark border border-border-navy rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-300">
                    <div className="p-8 border-b border-border-navy bg-navy-deep/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-accent/10 rounded-2xl flex items-center justify-center text-teal-accent border border-teal-accent/20">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-silver-crisp uppercase tracking-tight">Pagamento</h3>
                                <p className="text-xs text-silver-muted font-bold uppercase tracking-widest">Maquininha na entrega</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="p-6 bg-teal-accent/10 border-2 border-teal-accent rounded-2xl text-left relative group">
                                <div className="w-6 h-6 bg-teal-accent rounded-full flex items-center justify-center text-navy-deep mb-3">
                                    <CheckCircle2 size={16} />
                                </div>
                                <p className="font-black text-silver-crisp uppercase tracking-widest text-xs">Cartão</p>
                                <p className="text-[10px] text-teal-accent/70 font-bold uppercase mt-1">Crédito ou Débito</p>
                            </button>
                            <div className="p-6 bg-navy-deep/40 border border-border-navy rounded-2xl text-left opacity-40 grayscale flex flex-col justify-end">
                                <p className="font-black text-silver-muted uppercase tracking-widest text-xs">PIX</p>
                                <p className="text-[10px] text-silver-muted font-bold uppercase mt-1">Em breve</p>
                            </div>
                        </div>

                        <div className="p-8 bg-navy-deep rounded-2xl border border-border-navy space-y-4 shadow-inner">
                            <div className="flex justify-between items-center">
                                <span className="text-silver-muted text-xs font-bold uppercase tracking-widest">Subtotal</span>
                                <span className="text-silver-crisp font-bold">R$ {getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-silver-muted text-xs font-bold uppercase tracking-widest">Distância (Taxa)</span>
                                <span className="text-amber-500 font-bold italic text-xs">Calculado no fechamento</span>
                            </div>
                            <div className="flex justify-between items-center text-silver-crisp text-2xl font-black pt-5 border-t border-border-navy">
                                <span className="uppercase tracking-tighter">Total Estimado</span>
                                <span className="text-teal-accent tracking-tighter text-3xl font-mono">R$ {getTotal().toFixed(2)}+</span>
                            </div>
                            <p className="text-[9px] text-silver-muted text-center italic mt-2 uppercase tracking-widest">A taxa final será adicionada pela logística baseada no endereço</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="w-20 bg-navy-deep border border-border-navy text-silver-crisp flex items-center justify-center rounded-2xl hover:bg-navy-dark transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                onClick={handleFinalize}
                                disabled={loading}
                                className="flex-1 bg-teal-accent text-navy-deep font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest shadow-2xl shadow-teal-accent/20 hover:bg-teal-light disabled:opacity-30 transition-all text-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Finalizar Pedido • Enviar para o Forno'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
