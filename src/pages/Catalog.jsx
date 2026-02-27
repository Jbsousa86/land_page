import React, { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.nome?.toLowerCase().includes(term);
    const categoryMatch = product.categoria?.toLowerCase().includes(term);
    return nameMatch || categoryMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black/30 flex items-center justify-center">
        <p className="text-white text-xl">Loading products...</p>
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
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      <div className="bg-black/30 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white text-center mb-12">
            Catálogo de Produtos
          </h1>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Todas', ...new Set(products.map((p) => p.categoria).filter(Boolean))].sort().map((category) => {
              const count = category === 'Todas'
                ? products.length
                : products.filter((p) => p.categoria === category).length;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSearchTerm(category === 'Todas' ? '' : category);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm ${
                    (category === 'Todas' && searchTerm === '') || (category !== 'Todas' && searchTerm === category)
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-rose-100'
                  }`}
                >
                  {category} <span className="ml-1 opacity-90">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="mb-8 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-full shadow-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 pl-12"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-white text-center text-xl">Nenhum produto encontrado.</p>
          ) : (
            Object.entries(
              filteredProducts.reduce((acc, product) => {
                const category = product.categoria || 'Outros';
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
              }, {})
            ).sort((a, b) => {
              const term = searchTerm.toLowerCase();
              const catA = a[0].toLowerCase();
              const catB = b[0].toLowerCase();
              if (catA === term && catB !== term) return -1;
              if (catB === term && catA !== term) return 1;
              return a[0].localeCompare(b[0]);
            }).map(([category, categoryProducts]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/30 pb-2 inline-block">{category}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
