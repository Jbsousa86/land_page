import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const featuredProducts = products.filter(p => p.featured);

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
      {/* ================= HERO (Featured Products) ================= */}
      <section
        id="catalogo"
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Produtos em Destaque</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ================= QUEM SOU EU ================= */}
      <section
             id="quem-sou-eu"
              className="bg-rose-300 py-16 px-6"
      >
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* TEXTO */}
        <div className="text-center md:text-left md:order-1">
          <h2 className="text-2xl font-bold mb-4">
           Quem sou eu
          </h2>

             <p className="mb-4">
               Sou a <strong>Nana</strong>, da Eliane Importados Buquê Eterno, e essa loja romântica e criativa nasceu do amor pelos detalhes e pela emoção de presentear e criar produtos artesanais.
               Aqui, não vendemos apenas produtos. Vendemos sentimentos, momentos e emoções, transformados em buquês, box e presentes especiais.
               Temos produtos prontos para pronta entrega e também trabalhamos sob encomenda, criando cada peça com carinho, cuidado e atenção aos detalhes.
               Seja um presente imediato ou algo feito especialmente para alguém, tudo aqui carrega amor e significado.
               Somos de Ananás – TO, uma loja com atendimento próximo, humano e feito com o coração.
               Criamos presentes que falam por você. Pois nao vendemos apenas produtos, vendemos emoção.
             </p>

              <p>
                  A <strong>Eliane Importados</strong> nasceu com o objetivo de levar
                  produtos criativos, bonitos e de qualidade para quem valoriza
                  carinho nos detalhes e atendimento próximo.
              </p>
        </div>

    {/* FOTO */}
      <div className="flex justify-center md:justify-end md:order-2">
      <div className="w-full max-w-sm  rounded-3xl overflow-hidden shadow">
  <img
    src="/eliane.png"
    alt="Eliane Importados"
    className="w-full h-full object-contain"
  />
</div>

    </div>


  </div>
</section>

      {/* ================= DEPOIMENTOS ================= */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          O que nossos clientes dizem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Produtos lindos, amei!",
            "Atendimento excelente e rápido.",
            "Comprei para presente e foi um sucesso!",
          ].map((depoimento, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition text-center"
            >
              ⭐⭐⭐⭐⭐
              <p className="mt-3 italic">
                “{depoimento}”
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
