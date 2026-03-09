import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../store/useCart';
import CustomizationModal from '../components/CustomizationModal';

const Catalog = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    axios.get('/api/v1/catalog/categories'),
                    axios.get('/api/v1/catalog/products')
                ]);
                setCategories(catsRes.data);
                setProducts(prodsRes.data);
            } catch (err) {
                console.error("Failed to fetch catalog", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-silver-muted animate-pulse">Carregando cardápio 🔥...</div>;

    const pizzaFlavors = (Array.isArray(products) ? products : []).filter(p => categories.find(c => c.id === p.category_id)?.name === "Pizzas Artesanais");

    return (
        <div className="space-y-12 pb-20">
            {categories.map(category => (
                <section key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl font-black text-silver-crisp border-l-4 border-teal-accent pl-6 mb-8 uppercase tracking-tight">
                        {category.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.filter(p => p.category_id === category.id).map(product => (
                            <div
                                key={product.id}
                                className="bg-navy-dark/40 border border-border-navy rounded-2xl p-6 hover:border-teal-accent transition-all cursor-pointer group relative overflow-hidden"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-teal-accent/5 rounded-bl-full group-hover:bg-teal-accent/10 transition-all"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-silver-crisp group-hover:text-teal-accent transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="text-teal-accent font-mono font-bold text-lg">
                                        R$ {product.base_price.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-silver-muted text-sm leading-relaxed mb-6">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-2 text-teal-accent text-xs font-black uppercase tracking-[0.2em]">
                                    <span>Personalizar</span>
                                    <span className="w-8 h-[2px] bg-teal-accent/30 group-hover:w-full transition-all duration-500"></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {selectedProduct && (
                <CustomizationModal
                    isOpen={true}
                    product={selectedProduct}
                    flavors={pizzaFlavors}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Catalog;
