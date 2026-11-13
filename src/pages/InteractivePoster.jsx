import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { formatCurrency, parseCurrency } from '../utils/currency';

const THEME_STYLES = {
  rose: {
    pageBg: 'from-rose-50 via-rose-100 to-rose-200',
    badgeBg: 'bg-rose-600 text-white',
    titleText: 'text-rose-950',
    subText: 'text-rose-800/80',
    cardBg: 'bg-white border-rose-200 hover:border-rose-400',
    cardText: 'text-gray-900',
    pricePill: 'bg-rose-600 text-white',
    ctaBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    footerBg: 'bg-rose-950 text-white',
  },
  luxury: {
    pageBg: 'from-zinc-900 via-zinc-800 to-zinc-950',
    badgeBg: 'bg-amber-400 text-zinc-950',
    titleText: 'text-amber-100',
    subText: 'text-zinc-300',
    cardBg: 'bg-zinc-800/95 border-amber-500/40 hover:border-amber-400',
    cardText: 'text-zinc-100',
    pricePill: 'bg-amber-400 text-zinc-950',
    ctaBtn: 'bg-amber-400 hover:bg-amber-300 text-zinc-950',
    footerBg: 'bg-zinc-950 text-amber-100 border-t border-amber-500/20',
  },
  lavender: {
    pageBg: 'from-purple-50 via-purple-100 to-purple-200',
    badgeBg: 'bg-pink-600 text-white',
    titleText: 'text-purple-950',
    subText: 'text-purple-800/80',
    cardBg: 'bg-white border-purple-200 hover:border-purple-400',
    cardText: 'text-gray-900',
    pricePill: 'bg-purple-600 text-white',
    ctaBtn: 'bg-purple-600 hover:bg-purple-700 text-white',
    footerBg: 'bg-purple-950 text-white',
  },
  clean: {
    pageBg: 'from-white via-stone-50 to-stone-100',
    badgeBg: 'bg-gray-900 text-white',
    titleText: 'text-gray-900',
    subText: 'text-gray-600',
    cardBg: 'bg-white border-gray-200 hover:border-rose-400',
    cardText: 'text-gray-900',
    pricePill: 'bg-rose-500 text-white',
    ctaBtn: 'bg-rose-500 hover:bg-rose-600 text-white',
    footerBg: 'bg-gray-900 text-white',
  },
};

function formatPriceDisplay(rawPrice) {
  if (!rawPrice && rawPrice !== 0) return '';
  const str = String(rawPrice).trim();
  const parsed = parseCurrency(str);
  if (parsed > 0) {
    return formatCurrency(parsed);
  }
  return str.startsWith('R$') ? str : `R$ ${str}`;
}

const InteractivePoster = ({ onAddToCart, onOpenCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const params = new URLSearchParams(location.search);
  const idsParam = params.get('ids') || '';
  const themeKey = params.get('tema') || 'rose';
  const headline = params.get('titulo') || 'Presentes & Ofertas Especiais';
  const subheadline =
    params.get('sub') || 'Clique no seu produto favorito abaixo para comprar na nossa loja ✨';
  const badgeText = params.get('selo') ?? 'OFERTA ESPECIAL';
  const showUnitPrice = params.get('unit') !== '0';
  const unitSuffix = params.get('suf') || 'cada';

  let overrides = {};
  try {
    const ovParam = params.get('ov');
    if (ovParam) {
      overrides = JSON.parse(ovParam);
    }
  } catch {
    overrides = {};
  }

  const theme = THEME_STYLES[themeKey] || THEME_STYLES.rose;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts();
        const all = response.data || [];
        const requestedIds = idsParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        if (requestedIds.length > 0) {
          const matched = requestedIds
            .map((id) => all.find((p) => String(p.id) === String(id)))
            .filter(Boolean);
          setProducts(matched.length > 0 ? matched : all.slice(0, 4));
        } else {
          setProducts(all.slice(0, 4));
        }
      } catch (err) {
        console.error('Erro ao carregar produtos do cartaz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [idsParam]);

  const handleBuyProduct = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1800);
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const handleGoToProductInStore = (product) => {
    navigate(`/catalogo?produtos=${encodeURIComponent(idsParam || product.id)}&search=${encodeURIComponent(product.nome || '')}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
        <p className="text-lg font-semibold text-rose-800 animate-pulse">
          Carregando cartaz interativo...
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.pageBg} py-8 px-4 sm:px-6 flex flex-col items-center`}>
      {/* Clickable Poster Container */}
      <div className="w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-black/10 bg-white/40 backdrop-blur-sm flex flex-col">
        {/* Top Store Brand Header (Clickable to Home/Store) */}
        <div className="pt-8 pb-4 px-6 text-center flex flex-col items-center">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-3 group transition transform hover:scale-105"
            title="Ir para a loja Eliane Importados"
          >
            <img
              src="/logo.png"
              alt="Eliane Importados"
              className="w-14 h-14 rounded-2xl shadow-md object-cover"
            />
            <span
              className={`text-4xl sm:text-5xl font-bold ${theme.titleText}`}
              style={{ fontFamily: '"Dancing Script", cursive' }}
            >
              Eliane Importados
            </span>
          </Link>

          {badgeText && (
            <span
              className={`mt-4 inline-block px-5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm ${theme.badgeBg}`}
            >
              {badgeText}
            </span>
          )}

          <h1 className={`mt-3 text-2xl sm:text-4xl font-black leading-tight ${theme.titleText}`}>
            {headline}
          </h1>

          {subheadline && (
            <p className={`mt-2 text-sm sm:text-base max-w-xl ${theme.subText}`}>
              {subheadline}
            </p>
          )}

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-black/10 text-current">
            👆 Toque em qualquer produto para ver na loja ou comprar
          </div>
        </div>

        {/* Interactive Products Grid */}
        <div className="p-4 sm:p-6">
          <div
            className={`grid gap-4 sm:gap-6 ${
              products.length === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {products.map((product) => {
              const ov = overrides[product.id] || {};
              const displayPrice = formatPriceDisplay(
                ov.preco !== undefined ? ov.preco : product.preco
              );
              const oldPrice = ov.precoAntigo ? formatPriceDisplay(ov.precoAntigo) : '';

              return (
                <div
                  key={product.id}
                  onClick={() => handleGoToProductInStore(product)}
                  className={`group cursor-pointer rounded-2xl border-2 p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between ${theme.cardBg}`}
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-square flex items-center justify-center">
                      <img
                        src={product.img}
                        alt={product.nome}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.categoria && (
                        <span className="absolute top-2.5 left-2.5 bg-gray-900/80 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full">
                          {product.categoria}
                        </span>
                      )}
                      <span className="absolute bottom-2.5 right-2.5 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow opacity-90 group-hover:bg-rose-600 group-hover:text-white transition">
                        Ver na loja →
                      </span>
                    </div>

                    <h2 className={`mt-4 text-lg sm:text-xl font-extrabold text-center ${theme.cardText}`}>
                      {product.nome}
                    </h2>

                    {product.descricao && (
                      <p className="mt-1 text-xs sm:text-sm text-gray-500 text-center line-clamp-2">
                        {product.descricao}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex flex-col items-center gap-2">
                    {oldPrice && (
                      <span className="text-xs text-gray-400 font-semibold">
                        De <span className="line-through">{oldPrice}</span> por:
                      </span>
                    )}

                    <div className={`px-6 py-1.5 rounded-full text-lg sm:text-xl font-black shadow ${theme.pricePill}`}>
                      {displayPrice} {showUnitPrice && unitSuffix ? <span className="text-sm font-bold opacity-95">{unitSuffix}</span> : null}
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleBuyProduct(product)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm shadow transition cursor-pointer ${theme.ctaBtn}`}
                      >
                        {addedId === product.id ? '✓ Adicionado!' : '🛒 Comprar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGoToProductInStore(product)}
                        className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer"
                      >
                        🔍 Ver na Loja
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showUnitPrice && (
            <div className="mt-6 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-center text-xs sm:text-sm font-extrabold text-amber-900 shadow-sm">
              ⚠️ Preço por unidade — cada produto é vendido separadamente (não é kit)
            </div>
          )}

          {/* Main CTA Button to Full Store Catalog */}
          <div className="mt-8 text-center">
            <Link
              to={`/catalogo${idsParam ? `?produtos=${encodeURIComponent(idsParam)}` : ''}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base sm:text-lg shadow-xl transition transform hover:scale-105"
            >
              🛍️ Acessar Loja Completa ({products.length > 1 ? 'Ver ofertas e catálogo' : 'Ver mais produtos'})
            </Link>
          </div>
        </div>

        {/* Poster Footer */}
        <div className={`mt-4 py-5 px-6 text-center ${theme.footerBg}`}>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
            <a
              href="https://wa.me/5563992952695"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              📱 WhatsApp: (63) 99295-2695
            </a>
            <span>•</span>
            <a
              href="https://www.instagram.com/elianeimportados1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              📸 @elianeimportados1
            </a>
          </div>
          <p className="mt-1 text-xs opacity-80">📍 Ananás – TO · Bairro 4 Bocas</p>
        </div>
      </div>
    </div>
  );
};

export default InteractivePoster;
