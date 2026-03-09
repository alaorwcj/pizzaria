import { useCart } from '../store/useCart';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

const CartSidebar = ({ onCheckout, isVisible }) => {
    const { items, removeItem, updateQuantity, getTotal } = useCart();

    if (!isVisible) return null;

    return (
        <aside className="w-96 bg-navy-deep border-l border-border-navy flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border-navy flex items-center justify-between">
                <h2 className="text-xl font-bold text-silver-crisp flex items-center gap-3">
                    <ShoppingBag className="text-teal-accent" /> Carrinho
                </h2>
                <span className="bg-graphite text-teal-accent text-xs font-bold px-2 py-1 rounded-full">
                    {items.length} itens
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-silver-muted space-y-4 opacity-50">
                        <ShoppingBag size={48} />
                        <p>Seu carrinho está vazio</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="bg-navy-dark border border-border-navy rounded-lg p-4 space-y-3 shadow-inner">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-silver-crisp font-medium">{item.product.name}</h4>
                                    {item.is_half_and_half && (
                                        <p className="text-[10px] text-teal-accent font-black uppercase">Meio a Meio</p>
                                    )}
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-silver-muted hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center bg-graphite rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="p-1 hover:text-teal-accent text-silver-muted"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-mono text-silver-crisp">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:text-teal-accent text-silver-muted"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <span className="text-silver-crisp font-mono text-sm font-bold">
                                    R$ {(item.product.base_price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-6 bg-navy-dark border-t border-border-navy space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-silver-muted text-sm uppercase tracking-wider font-bold">Resumo</span>
                    <div className="text-right">
                        <p className="text-[10px] text-silver-muted uppercase">Total a pagar</p>
                        <p className="text-2xl font-black text-teal-accent font-mono italic">
                            R$ {getTotal().toFixed(2)}
                        </p>
                    </div>
                </div>
                <button
                    disabled={items.length === 0}
                    onClick={onCheckout}
                    className="w-full bg-teal-accent hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-navy-deep font-black py-4 rounded-xl transition-all shadow-lg shadow-teal-500/20 uppercase tracking-widest text-sm"
                >
                    Finalizar Pedido
                </button>
            </div>
        </aside>
    );
};

export default CartSidebar;
