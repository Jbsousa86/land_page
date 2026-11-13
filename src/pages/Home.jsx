import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import Catalog from './Catalog';
import { formatCurrency, parseCurrency } from '../utils/currency';

const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products for home page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const isAboutPage = new URLSearchParams(location.search).get('aba') === 'sobre';
  const featuredProducts = products.filter((product) => product.featured);
  const currentProduct = featuredProducts[activeSlide] || featuredProducts[0];

  useEffect(() => {
    if (featuredProducts.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % featuredProducts.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [featuredProducts.length]);

  const changeSlide = (direction) => {
    setActiveSlide((current) => (
      (current + direction + featuredProducts.length) % featuredProducts.length
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black/30 flex items-center justify-center">
        <p className="text-white text-xl">Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black/30 flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <>
      {currentProduct && (
        <section
          className="relative bg-cover bg-center border-b border-white/10"
          style={{ backgroundImage: "url('/bg.jpg')" }}
          aria-label="Produtos em destaque"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 py-5 sm:py-7">
            <h1 className="mb-4 text-center text-xl sm:text-2xl font-bold text-white">
              ✨ Produtos em Destaque
            </h1>

            <div className="mx-auto max-w-xl sm:max-w-2xl overflow-hidden rounded-2xl bg-black/55 border border-white/15 shadow-xl backdrop-blur-sm">
              <div className="relative flex h-56 sm:h-64 md:h-72 items-center justify-center bg-black/25 p-2">
                <img
                  key={currentProduct.id}
                  src={currentProduct.img}
                  alt={currentProduct.nome || 'Produto em destaque'}
                  className="h-full w-full object-contain"
                />
                {featuredProducts.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => changeSlide(-1)}
                      aria-label="Ver produto em destaque anterior"
                      className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl text-gray-800 shadow transition hover:bg-white cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => changeSlide(1)}
                      aria-label="Ver próximo produto em destaque"
                      className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl text-gray-800 shadow transition hover:bg-white cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center gap-2.5 px-4 py-3.5 text-center text-white sm:flex-row sm:justify-between sm:px-5 sm:text-left">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold leading-snug">
                    {currentProduct.nome}
                  </h2>
                  <div className="mt-0.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {currentProduct.categoria && (
                      <span className="text-xs text-white/75">{currentProduct.categoria}</span>
                    )}
                    {currentProduct.preco && (
                      <span className="text-sm font-extrabold text-rose-300">
                        {formatCurrency(parseCurrency(currentProduct.preco))}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(currentProduct)}
                  className="w-full sm:w-auto shrink-0 rounded-lg bg-rose-500 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow transition hover:bg-rose-600 cursor-pointer"
                >
                  Adicionar ao carrinho
                </button>
              </div>

              {featuredProducts.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-3.5" aria-label="Selecionar produto em destaque">
                  {featuredProducts.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Mostrar destaque ${index + 1}: ${product.nome || 'Produto'}`}
                      aria-current={index === activeSlide ? 'true' : undefined}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        index === activeSlide ? 'w-6 bg-rose-400' : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {!isAboutPage ? (
            <div id="catalogo">
              <Catalog onAddToCart={onAddToCart} embedded />
            </div>
          ) : (
            <>
              <section id="quem-sou-eu" className="rounded-2xl bg-rose-300 px-6 py-10 sm:px-10">
                <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
                  <div className="text-center md:text-left">
                    <h2 className="mb-4 text-2xl font-bold">Quem sou eu</h2>
                    <p className="mb-4">
                      Sou a <strong>Nana</strong>, da Eliane Importados Buquê Eterno, e essa loja
                      romântica e criativa nasceu do amor pelos detalhes e pela emoção de presentear
                      e criar produtos artesanais. Aqui, não vendemos apenas produtos. Vendemos
                      sentimentos, momentos e emoções, transformados em buquês, box e presentes
                      especiais. Temos produtos prontos para pronta entrega e também trabalhamos sob
                      encomenda, criando cada peça com carinho, cuidado e atenção aos detalhes. Seja
                      um presente imediato ou algo feito especialmente para alguém, tudo aqui carrega
                      amor e significado. Somos de Ananás – TO, uma loja com atendimento próximo,
                      humano e feito com o coração. Criamos presentes que falam por você. Pois não
                      vendemos apenas produtos, vendemos emoção.
                    </p>
                    <p>
                      A <strong>Eliane Importados</strong> nasceu com o objetivo de levar produtos
                      criativos, bonitos e de qualidade para quem valoriza carinho nos detalhes e
                      atendimento próximo.
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <div className="w-full max-w-sm overflow-hidden rounded-3xl shadow">
                      <img
                        src="/eliane.png"
                        alt="Eliane Importados"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="mx-auto max-w-5xl px-2 py-12">
                <h2 className="mb-8 text-center text-2xl font-bold">
                  O que nossos clientes dizem
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[
                    'Produtos lindos, amei!',
                    'Atendimento excelente e rápido.',
                    'Comprei para presente e foi um sucesso!',
                  ].map((depoimento) => (
                    <div
                      key={depoimento}
                      className="rounded-2xl bg-white p-6 text-center shadow-md transition hover:scale-105 hover:shadow-xl"
                    >
                      ⭐⭐⭐⭐⭐
                      <p className="mt-3 italic">“{depoimento}”</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
