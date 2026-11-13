import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PosterGeneratorModal from '../components/PosterGeneratorModal';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForPoster, setSelectedForPoster] = useState([]);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [posterInitialIds, setPosterInitialIds] = useState([]);
  const { logout } = useAuth();

  const toggleSelectProduct = (id) => {
    setSelectedForPoster((prev) => {
      const exists = prev.some((item) => String(item) === String(id));
      if (exists) {
        return prev.filter((item) => String(item) !== String(id));
      }
      if (prev.length >= 4) {
        alert('Selecione no máximo 4 produtos por cartaz.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const openPosterForSelected = () => {
    if (selectedForPoster.length > 0) {
      setPosterInitialIds(selectedForPoster);
    } else if (products.length > 0) {
      setPosterInitialIds(products.slice(0, 2).map((p) => p.id));
    }
    setIsPosterModalOpen(true);
  };

  const openPosterForSingleProduct = (id) => {
    setPosterInitialIds([id]);
    setIsPosterModalOpen(true);
  };

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError('Failed to delete product.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8">
        <p className="text-xl">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center sm:text-left">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left mt-1">
              Marque de 1 a 4 produtos na tabela para montar um encarte ou clique em &ldquo;Cartaz&rdquo; no produto desejado.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={openPosterForSelected}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded text-center shadow transition cursor-pointer"
            >
              {selectedForPoster.length > 0
                ? `🎨 Gerar Cartaz (${selectedForPoster.length} ${selectedForPoster.length === 1 ? 'item' : 'itens'})`
                : '🎨 Criar Cartaz Social'}
            </button>
            <Link
              to="/admin/products/new"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Novo produto
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Sair
            </button>
          </div>
        </div>

        {selectedForPoster.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-900">
            <span>
              <strong>{selectedForPoster.length}</strong> de 4 produtos selecionados para o cartaz promocional.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openPosterForSelected}
                className="font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
              >
                Abrir Estúdio de Cartaz
              </button>
              <button
                type="button"
                onClick={() => setSelectedForPoster([])}
                className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Limpar seleção
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto"> {/* Added for horizontal scrolling on small screens */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cartaz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const isChecked = selectedForPoster.some((id) => String(id) === String(product.id));
                  return (
                    <tr key={product.id} className={isChecked ? 'bg-rose-50/40' : ''}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectProduct(product.id)}
                          aria-label={`Selecionar ${product.nome} para cartaz`}
                          className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <img src={product.img} alt={product.nome} className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded" /> {/* Adjusted image size */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.preco}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.featured ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"> {/* Stack buttons on small screens */}
                          <button
                            type="button"
                            onClick={() => openPosterForSingleProduct(product.id)}
                            className="text-rose-600 hover:text-rose-900 font-semibold cursor-pointer"
                          >
                            🎨 Cartaz
                          </button>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PosterGeneratorModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        allProducts={products}
        initialSelectedIds={posterInitialIds}
      />
    </div>
  );
};

export default AdminDashboard;
