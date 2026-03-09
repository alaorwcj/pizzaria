import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../store/useCart';

const CustomizationModal = ({ product, isOpen, onClose, flavors = [] }) => {
    if (!isOpen || !product) return null;

    const addItem = useCart((state) => state.addItem);
    const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
    const [flavor1, setFlavor1] = useState(product.id);
    const [flavor2, setFlavor2] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState([]);

    const addons = [
        { id: 'borda-cheddar', name: 'Borda Cheddar', extra_price: 15.00 },
        { id: 'borda-choc', name: 'Borda Chocolate', extra_price: 18.00 },
    ];

    const handleAdd = () => {
        addItem(product, {
            is_half_and_half: isHalfAndHalf,
            flavor_2_id: isHalfAndHalf ? flavor2 : null,
            quantity,
            addons: selectedAddons,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm">
            <div className="bg-navy-dark border border-border-navy w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border-navy flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-silver-crisp">{product.name}</h3>
                        <p className="text-sm text-silver-muted">Personalize sua escolha</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-graphite rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Pizza Type Toggle */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-teal-accent uppercase tracking-widest">Estilo da Pizza</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsHalfAndHalf(false)}
                                className={`p-4 rounded-xl border-2 transition-all ${!isHalfAndHalf ? 'border-teal-accent bg-teal-accent/10 text-silver-crisp' : 'border-border-navy text-silver-muted'}`}
                            >
                                Sabor Único
                            </button>
                            <button
                                onClick={() => setIsHalfAndHalf(true)}
                                className={`p-4 rounded-xl border-2 transition-all ${isHalfAndHalf ? 'border-teal-accent bg-teal-accent/10 text-silver-crisp' : 'border-border-navy text-silver-muted'}`}
                            >
                                Meio a Meio
                            </button>
                        </div>
                    </div>

                    {/* Flavor Selection */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-teal-accent uppercase tracking-widest">
                            {isHalfAndHalf ? 'Escolha os Sabores' : 'Confirme o Sabor'}
                        </p>
                        <select
                            value={flavor1}
                            onChange={(e) => setFlavor1(parseInt(e.target.value))}
                            className="w-full bg-graphite border-none rounded-xl p-4 text-silver-crisp focus:ring-2 focus:ring-teal-accent"
                        >
                            {flavors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>

                        {isHalfAndHalf && (
                            <select
                                value={flavor2 || ''}
                                onChange={(e) => setFlavor2(parseInt(e.target.value))}
                                className="w-full bg-graphite border-none rounded-xl p-4 text-silver-crisp focus:ring-2 focus:ring-teal-accent"
                            >
                                <option value="" disabled>Selecione o segundo sabor...</option>
                                {flavors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        )}
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-teal-accent uppercase tracking-widest">Adicionais de Borda</p>
                        <div className="space-y-3">
                            {addons.map(addon => (
                                <label key={addon.id} className="flex items-center justify-between p-4 bg-navy-deep rounded-xl cursor-pointer group hover:bg-graphite transition-colors border border-transparent hover:border-border-navy">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedAddons.find(a => a.id === addon.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedAddons([...selectedAddons, addon]);
                                                else setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
                                            }}
                                        />
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${selectedAddons.find(a => a.id === addon.id) ? 'bg-teal-accent border-teal-accent' : 'border-silver-muted'}`}>
                                            {selectedAddons.find(a => a.id === addon.id) && <Check size={12} className="text-navy-deep font-bold" />}
                                        </div>
                                        <span className="text-silver-crisp font-medium">{addon.name}</span>
                                    </div>
                                    <span className="text-silver-muted font-mono text-sm">+ R$ {addon.extra_price.toFixed(2)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-navy-deep border-t border-border-navy flex items-center justify-between gap-6">
                    <div className="flex items-center bg-graphite rounded-xl p-1 shrink-0">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-teal-accent text-silver-muted"><Minus size={18} /></button>
                        <span className="w-10 text-center font-mono font-bold text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-teal-accent text-silver-muted"><Plus size={18} /></button>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isHalfAndHalf && !flavor2}
                        className="flex-1 bg-teal-accent hover:opacity-90 disabled:opacity-30 text-navy-deep font-black py-4 rounded-xl transition-all shadow-lg shadow-teal-500/10 uppercase tracking-widest text-sm"
                    >
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;
