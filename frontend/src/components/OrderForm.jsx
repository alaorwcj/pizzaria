import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const OrderForm = () => {
  const [promotion, setPromotion] = useState('PROMO_ESTENDIDA');
  const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
  const [flavor1, setFlavor1] = useState('Calabresa Premium');
  const [flavor2, setFlavor2] = useState('');
  const [crust, setCrust] = useState('DEFAULT'); // For Combo B
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    whatsapp: '',
    address: ''
  });

  const allowedComboFlavors = [
    { id: 1, name: "Frango com Catupiry", desc: "Peito de frango desfiado premium, Catupiry legítimo, toque de orégano fresco.", price: 54.00, tag: "BEST SELLER" },
    { id: 2, name: "Calabresa Premium", desc: "Calabresa artesanal defumada em lenha frutífera, cebola roxa marinada.", price: 49.00, tag: "TRADICIONAL" },
    { id: 3, name: "Toscana d'Oro", desc: "Mussarela de búfala, manjericão genovês, tomate cereja confitado.", price: 52.00, tag: "CHEF'S CHOICE" },
    { id: 4, name: "Mussarela Speciale", desc: "Blend exclusivo de três queijos com maturação controlada.", price: 45.00, tag: "ESSENCIAL" },
    { id: 5, name: "Portuguesa Imperial", desc: "Presunto Royale, ovos, ervilhas frescas, cebola e azeitonas pretas.", price: 58.00, tag: "COMPLETA" }
  ];

  const extraFlavors = [
    { id: 6, name: "Camarão Premium", desc: "Camarões Grelhados ao molho de ervas e queijo brie.", price: 82.00, tag: "INDISPONÍVEL", disabled: true }
  ];

  const allFlavors = [...allowedComboFlavors, ...extraFlavors];

  useEffect(() => {
    if (promotion !== '') {
      setIsHalfAndHalf(false);
      setFlavor2('');
    }
    // Reset flavor 1 if it becomes unavailable in current promo
    const currentAllowed = promotion === 'PROMO_ESTENDIDA' ? ["Calabresa Premium", "Mussarela Speciale"] : (promotion !== '' ? allowedComboFlavors.map(f => f.name) : allFlavors.map(f => f.name));
    if (!currentAllowed.includes(flavor1)) {
      setFlavor1(currentAllowed[0] || '');
    }
  }, [promotion]);

  const calculateTotal = () => {
    if (promotion === 'PROMO_ESTENDIDA') return 32.99;
    if (promotion === 'COMBO_A') return 160.00;
    if (promotion === 'COMBO_B') return 70.00;

    const f1 = allFlavors.find(f => f.name === flavor1);
    const f2 = allFlavors.find(f => f.name === flavor2);
    if (isHalfAndHalf && f1 && f2) return (f1.price + f2.price) / 2;
    return f1?.price || 0;
  };

  const handleTransmit = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const payload = {
        customer: {
          name: customer.name || 'Titular da Reserva',
          whatsapp: customer.whatsapp || '11912809999',
          address: customer.address || 'Local de Entrega'
        },
        items: [{
          flavor_id: allFlavors.find(f => f.name === flavor1)?.id || 0,
          is_half_and_half: isHalfAndHalf,
          flavor_2_id: isHalfAndHalf ? allFlavors.find(f => f.name === flavor2)?.id : null,
          crust_type: promotion === 'COMBO_B' ? crust : 'DEFAULT'
        }],
        promotion_id: promotion || null
      };
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccessMessage('PEDIDO TRANSMITIDO COM SUCESSO! 🔥');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        const err = await res.json();
        alert(`Erro: ${err.detail}`);
      }
    } catch (e) { alert('Erro de conexão.'); }
    setLoading(false);
  };

  const currentFlavors = promotion === 'PROMO_ESTENDIDA'
    ? allowedComboFlavors.filter(f => ["Calabresa Premium", "Mussarela Speciale"].includes(f.name))
    : (promotion !== '' ? allowedComboFlavors : allFlavors);

  return (
    <div className="dark flex flex-col h-screen bg-navy-deep text-silver-muted font-sans antialiased overflow-hidden">
      {/* Header with Fire Branding */}
      <header className="h-16 shrink-0 border-b border-border-navy bg-navy-dark px-6 flex items-center justify-between z-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-teal-accent/5 to-transparent pointer-events-none"></div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-accent flex items-center justify-center text-navy-deep font-bold text-lg rounded-sm shadow-[0_0_15px_rgba(45,212,191,0.4)] relative overflow-hidden group">
              <span className="material-symbols-outlined text-sm relative z-10">local_pizza</span>
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-silver-crisp tracking-tight leading-none uppercase">Daniel's Forneria</h1>
              <p className="text-[10px] text-teal-accent font-extrabold tracking-[.1em] uppercase mt-1 flex items-center gap-1">
                <span className="text-[8px] animate-pulse">🔥</span> MEGA PROMOÇÃO DE INAUGURAÇÃO
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-silver-crisp">Unidade Corporate</p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse shadow-[0_0_5px_rgba(45,212,191,0.8)]"></div>
              <p className="text-[10px] text-silver-muted font-bold tracking-tight">STATUS: ONLINE</p>
            </div>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-graphite text-silver-crisp hover:scale-105 transition-all border border-border-navy shadow-sm">
            <span className="material-symbols-outlined text-lg">account_circle</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Resumo Moderno */}
        <aside className="w-80 shrink-0 border-r border-border-navy bg-navy-dark flex flex-col z-40 relative">
          <div className="p-6 border-b border-border-navy bg-navy-deep/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-teal-accent text-lg">shopping_cart_checkout</span>
              <h2 className="text-sm font-bold text-silver-crisp uppercase tracking-[.15em]">Seu Pedido</h2>
            </div>
            <p className="text-[9px] text-silver-muted font-mono tracking-widest uppercase opacity-60">ID: DF-{new Date().getTime().toString().slice(-6)}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {flavor1 && (
              <div className="p-3 border border-border-navy bg-navy-deep/40 rounded-sm relative group hover:border-teal-accent transition-all duration-300">
                <div className="text-[11px] leading-tight flex flex-col gap-1">
                  <p className="font-bold text-silver-crisp uppercase tracking-tighter">{isHalfAndHalf ? `${flavor1} / ${flavor2 || '...'}` : flavor1}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-bold text-teal-accent/70 uppercase">{promotion ? 'Plano Promo' : 'Individual'}</p>
                    {promotion === 'COMBO_B' && <span className="text-[9px] font-bold text-silver-muted/50">+ {crust}</span>}
                  </div>
                </div>
                <span className="text-[12px] font-bold text-silver-crisp mt-2 block">R$ {calculateTotal().toFixed(2)}</span>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
              </div>
            )}
            {promotion === 'COMBO_B' && (
              <div className="p-3 border border-border-navy bg-navy-deep/40 rounded-sm opacity-80">
                <div className="text-[11px] leading-tight">
                  <p className="font-bold text-silver-crisp uppercase tracking-tighter">Bebida & Borda Recheada</p>
                  <p className="text-[9px] text-silver-muted font-medium mt-1 uppercase">Combo Dani's Exclusive</p>
                </div>
                <span className="text-[9px] font-extrabold text-teal-accent bg-teal-accent/5 border border-teal-accent/20 px-2 py-0.5 mt-2 inline-block tracking-widest">CORTESIA</span>
              </div>
            )}
          </div>

          <div className="p-6 bg-navy-deep border-t border-border-navy space-y-5 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-accent/30 to-transparent"></div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-silver-muted/60">
                <span>Subtotal</span>
                <span className="text-silver-crisp">R$ {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-silver-muted/60">
                <span>Logística</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-teal-accent">ISENTO</span>
                  <span className="material-symbols-outlined text-[12px] text-teal-accent">check_circle</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border-navy/50 flex justify-between items-end">
                <span className="text-[10px] font-black text-silver-muted/30 uppercase mb-1 tracking-widest">Total Consolidado</span>
                <span className="text-4xl font-black text-silver-crisp tracking-tighter animate-pulse-slow">R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {successMessage && (
              <div className="bg-teal-accent/10 border border-teal-accent/30 p-2.5 rounded-sm text-center shadow-[0_0_15px_rgba(45,212,191,0.05)]">
                <p className="text-[9px] font-black text-teal-accent tracking-[.3em] uppercase">{successMessage}</p>
              </div>
            )}

            <button
              disabled={!flavor1 || loading}
              onClick={handleTransmit}
              className="w-full bg-teal-accent hover:bg-teal-accent/90 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed text-navy-deep font-black py-4 text-[10px] uppercase tracking-[.3em] transition-all duration-500 relative overflow-hidden group shadow-[0_10px_30px_-5px_rgba(45,212,191,0.3)] active:scale-95 rounded-[2px]"
            >
              <span className="relative z-10">{loading ? 'PROCESSANDO...' : 'Transmitir Pedido'}</span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
            </button>
          </div>
        </aside>

        {/* Main Content - On Fire */}
        <main className="flex-1 overflow-y-auto bg-navy-deep custom-scrollbar">
          {/* Hero Section Refined */}
          <div className="relative h-64 flex items-center overflow-hidden border-b border-border-navy group">
            <img alt="Fire" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-[20s] ease-linear" src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2674&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-teal-accent">local_fire_department</span>
            </div>
            <div className="relative px-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-teal-accent tracking-[0.6em] uppercase border border-teal-accent/30 px-3 py-1 bg-teal-accent/5 backdrop-blur-sm">Executive Lounge</span>
                <span className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-ping"></span>
              </div>
              <h2 className="text-5xl font-black text-silver-crisp tracking-[-.05em] leading-none mb-4 uppercase italic">Painel de Composição</h2>
              <p className="text-[11px] text-silver-muted max-w-sm leading-relaxed font-bold uppercase tracking-tight opacity-70">Sistemas de alta performance para operações delivery de elite. Precisão, agilidade e excelência gastronômica.</p>
            </div>
          </div>

          <div className="p-12 max-w-6xl mx-auto space-y-16">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">

              {/* Dados do Cliente */}
              <section className="animate-fade-in space-y-8">
                <div className="section-header group">
                  <div className="w-10 h-10 border border-border-navy flex items-center justify-center group-hover:border-teal-accent transition-colors">
                    <span className="material-symbols-outlined text-teal-accent text-xl">id_card</span>
                  </div>
                  <h3 className="section-title text-[11px] tracking-[.3em] font-black">Dados Corporativos</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Titular da Reserva', key: 'name', ph: 'Nome Completo', type: 'text' },
                    { label: 'Telefone Direto', key: 'whatsapp', ph: '+55 11 9XXXX-XXXX', type: 'tel' }
                  ].map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-silver-muted/40 tracking-[.25em]">{field.label}</label>
                      <input
                        className="executive-input w-full px-4 rounded-none bg-navy-dark/30 hover:border-slate-500 transition-all focus:bg-navy-dark"
                        placeholder={field.ph}
                        type={field.type}
                        value={customer[field.key]}
                        onChange={(e) => setCustomer({ ...customer, [field.key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-silver-muted/40 tracking-[.25em]">Setor de Entrega / Logradouro</label>
                    <input
                      className="executive-input w-full px-4 rounded-none bg-navy-dark/30 hover:border-slate-500 transition-all focus:bg-navy-dark"
                      placeholder="Endereço detalhado para agilidade na logística"
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              {/* Plano de Consumo Refinado */}
              <section className="animate-fade-in space-y-8">
                <div className="section-header group">
                  <div className="w-10 h-10 border border-border-navy flex items-center justify-center group-hover:border-teal-accent transition-colors">
                    <span className="material-symbols-outlined text-teal-accent text-xl">loyalty</span>
                  </div>
                  <h3 className="section-title text-[11px] tracking-[.3em] font-black">Plano de Consumo</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'PROMO_ESTENDIDA', title: 'PROMOÇÃO ESTENDIDA', subtitle: 'Indispensável: Calabresa ou Mussarela', price: 'R$ 32,99', badge: 'OFERTA' },
                    { id: 'COMBO_B', title: 'COMBO DANI\'S (2 PIZZAS + BEBIDA)', subtitle: 'Padrão Corporate + Borda Recheada Grátis', price: 'R$ 70,00', badge: 'MELHOR VALOR' },
                    { id: 'COMBO_A', title: 'GRAND GOURMET (5 PIZZAS)', subtitle: 'Alta Escala: Ideal para grupos e eventos', price: 'R$ 160,00', badge: 'EVENTO' },
                    { id: '', title: 'À LA CARTE (UNITÁRIO)', subtitle: 'Personalização sem restrições de plano', price: '-', badge: 'PADRÃO' }
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-5 p-4 border cursor-pointer transition-all duration-300 relative group overflow-hidden ${promotion === opt.id ? 'border-teal-accent/60 bg-navy-dark shadow-[0_0_20px_rgba(45,212,191,0.05)]' : 'border-border-navy bg-navy-dark/30 hover:border-slate-600 hover:bg-graphite/20'}`}
                    >
                      <input
                        className="w-4 h-4 text-teal-accent bg-navy-deep border-border-navy focus:ring-teal-accent focus:ring-offset-0 transition-transform group-hover:scale-110"
                        name="combo"
                        type="radio"
                        checked={promotion === opt.id}
                        onChange={() => setPromotion(opt.id)}
                      />
                      <div className="flex-1 z-10">
                        <div className="flex items-center gap-3">
                          <p className={`text-[11px] font-black tracking-tight uppercase ${promotion === opt.id ? 'text-teal-accent' : 'text-silver-crisp'}`}>{opt.title}</p>
                          <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-[1px] tracking-[.15em] ${promotion === opt.id ? 'bg-teal-accent text-navy-deep' : 'bg-slate-800 text-silver-muted'}`}>{opt.badge}</span>
                        </div>
                        <p className="text-[9px] text-silver-muted font-bold mt-1 uppercase tracking-tight opacity-60">{opt.subtitle}</p>
                      </div>
                      <span className={`text-[13px] font-black z-10 italic ${promotion === opt.id ? 'text-teal-accent scale-110' : 'text-silver-crisp'} transition-transform`}>{opt.price}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Borda Recheada selection for Combo B */}
              {promotion === 'COMBO_B' && (
                <section className="xl:col-span-2 animate-fade-in">
                  <div className="bg-teal-accent/5 border border-teal-accent/40 p-6 flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-accent/10 border border-teal-accent/30 flex items-center justify-center animate-bounce-slow">
                        <span className="material-symbols-outlined text-teal-accent text-2xl">star_rate</span>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-black text-teal-accent tracking-widest uppercase">UPGRADE: Borda Recheada Especial</h4>
                        <p className="text-[10px] text-silver-muted font-bold uppercase mt-1">Exclusivo para o Combo Dani's por R$ 70,00</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {['DEFAULT', 'CHEDDAR', 'CHOCOLATE'].map(type => (
                        <button
                          key={type}
                          onClick={() => setCrust(type)}
                          className={`px-6 py-2.5 text-[9px] font-black tracking-[.25em] uppercase transition-all border ${crust === type ? 'border-teal-accent bg-teal-accent text-navy-deep shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'border-border-navy bg-navy-dark text-silver-muted hover:border-slate-500'}`}
                        >
                          {type === 'DEFAULT' ? 'Sem Borda' : `Sabor ${type}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Seleção de Sabores cards */}
              <section className="xl:col-span-2 mt-8 animate-fade-in">
                <div className="section-header justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-teal-accent text-xl">restaurant_menu</span>
                    <h3 className="section-title text-[10px] tracking-[.3em] font-black uppercase">Cardápio de Alta Performance</h3>
                  </div>
                  <div className="flex items-center gap-10">
                    <label className={`flex items-center gap-3 cursor-pointer group transition-all ${promotion !== '' ? 'opacity-20 pointer-events-none' : 'opacity-80 hover:opacity-100'}`}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-teal-accent bg-navy-deep border-border-navy rounded-none cursor-pointer"
                        checked={isHalfAndHalf}
                        disabled={promotion !== ''}
                        onChange={(e) => setIsHalfAndHalf(e.target.checked)}
                      />
                      <span className="text-[9px] font-black uppercase tracking-[.25em] text-silver-crisp group-hover:text-teal-accent transition-colors">
                        Configuração Meio a Meio {promotion !== '' && <span className="text-[7px] text-teal-accent/50 block leading-none mt-1 font-bold">(DESATIVADO PARA PLANOS)</span>}
                      </span>
                    </label>
                    <div className="flex gap-1">
                      <button className="px-5 py-2 bg-graphite/40 text-[8px] font-black tracking-widest text-silver-crisp border border-border-navy hover:bg-navy-dark hover:border-teal-accent/40 transition-all uppercase">FILTRAR</button>
                      <button className="px-5 py-2 bg-graphite/40 text-[8px] font-black tracking-widest text-silver-crisp border border-border-navy hover:bg-navy-dark hover:border-teal-accent/40 transition-all uppercase">ORDENAR</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentFlavors.map(flavor => (
                    <div
                      key={flavor.id}
                      onClick={() => {
                        if (flavor.disabled) return;
                        if (isHalfAndHalf) {
                          if (flavor1 === flavor.name) setFlavor1('');
                          else if (!flavor1) setFlavor1(flavor.name);
                          else if (flavor2 === flavor.name) setFlavor2('');
                          else setFlavor2(flavor.name);
                        } else {
                          setFlavor1(flavor1 === flavor.name ? '' : flavor.name);
                        }
                      }}
                      className={`group relative border transition-all duration-500 p-5 bg-navy-dark/40 rounded-none overflow-hidden ${flavor.disabled ? 'opacity-20 grayscale cursor-not-allowed border-dashed' : 'cursor-pointer'} ${flavor1 === flavor.name || flavor2 === flavor.name ? 'border-teal-accent/80 bg-navy-dark shadow-[inset_0_0_30px_rgba(45,212,191,0.05),0_15px_40px_-5px_rgba(0,0,0,0.5)] scale-[1.02]' : 'border-border-navy hover:border-slate-500'}`}
                    >
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className={`text-[8px] font-black px-2 py-1 tracking-[.25em] ${flavor.tag === 'BEST SELLER' ? 'text-teal-accent bg-teal-accent/10 border border-teal-accent/30 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'text-silver-muted bg-white/5 border border-white/10 opacity-70'}`}>
                          {flavor.tag}
                        </span>
                        <div className={`w-5 h-5 flex items-center justify-center border transition-all duration-500 ${flavor1 === flavor.name || flavor2 === flavor.name ? 'bg-teal-accent border-teal-accent scale-110' : 'border-border-navy bg-navy-deep'}`}>
                          {(flavor1 === flavor.name || flavor2 === flavor.name) && <span className="material-symbols-outlined text-navy-deep text-[16px] font-black">check</span>}
                        </div>
                      </div>
                      <h4 className={`text-[13px] font-black tracking-widest uppercase mb-2 group-hover:text-teal-accent transition-colors ${flavor1 === flavor.name || flavor2 === flavor.name ? 'text-teal-accent' : 'text-silver-crisp'}`}>{flavor.name}</h4>
                      <p className="text-[10px] text-silver-muted/70 leading-relaxed mb-6 font-bold tracking-tight min-h-[40px] italic">{flavor.desc}</p>
                      <div className="flex justify-between items-center border-t border-border-navy/40 pt-4 pb-1 relative z-10">
                        <div className="flex gap-3">
                          <span className="material-symbols-outlined text-silver-muted/40 text-[16px] hover:text-teal-accent hover:rotate-12 transition-all">nutrition</span>
                          <span className="material-symbols-outlined text-silver-muted/40 text-[16px] hover:text-teal-accent hover:-rotate-12 transition-all">workspace_premium</span>
                        </div>
                        <span className="text-[16px] font-black text-silver-crisp tracking-tighter italic">R$ {flavor.price.toFixed(2)}</span>
                      </div>
                      {/* Indicators for half-and-half */}
                      {isHalfAndHalf && flavor1 === flavor.name && <div className="absolute inset-0 border-r-4 border-teal-accent pointer-events-none"></div>}
                      {isHalfAndHalf && flavor2 === flavor.name && <div className="absolute inset-0 border-l-4 border-silver-crisp pointer-events-none"></div>}
                      {/* Decoration */}
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-teal-accent/5 rounded-full blur-xl group-hover:bg-teal-accent/10 transition-all"></div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <footer className="p-16 border-t border-border-navy bg-navy-dark/50 flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div className="grid grid-cols-12 h-full gap-4">
                {Array(24).fill(0).map((_, i) => <div key={i} className="border-r border-teal-accent"></div>)}
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-3 relative z-10">
              <div className="text-[11px] font-black text-silver-crisp tracking-[.6em] uppercase">Daniel's Forneria</div>
              <div className="text-[9px] font-bold text-silver-muted/40 uppercase tracking-[.4em]">© 2024 - SISTEMAS DE ALTA IMPACTO GASTRONOMICO</div>
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[9px] font-black uppercase tracking-[.3em] text-silver-muted relative z-10">
              <a className="hover:text-teal-accent hover:translate-x-1 transition-all border-b border-transparent hover:border-teal-accent/30 pb-1" href="#">Support Desk</a>
              <a className="hover:text-teal-accent hover:translate-x-1 transition-all border-b border-transparent hover:border-teal-accent/30 pb-1" href="#">Data Governance</a>
              <a className="hover:text-teal-accent hover:translate-x-1 transition-all border-b border-transparent hover:border-teal-accent/30 pb-1" href="#">Corporate Terms</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default OrderForm;
