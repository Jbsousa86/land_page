import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContextCore';
import PosterGeneratorModal from '../components/PosterGeneratorModal';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForPoster, setSelectedForPoster] = useState([]);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [posterInitialIds, setPosterInitialIds] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const { logout, verifyPassword } = useAuth();

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
      const response = await api.getProducts({ includeHidden: true });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (product) => {
    const nextVisible = product.visivel === false;
    try {
      setTogglingId(product.id);
      const response = await api.updateProduct(product.id, {
        ...product,
        visivel: nextVisible,
      });
      setProducts((prev) =>
        prev.map((p) => (String(p.id) === String(product.id) ? response.data : p))
      );
    } catch (err) {
      console.error('Erro ao alterar visibilidade:', err);
      alert('Não foi possível alterar a visibilidade do produto.');
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRequestDelete = (product) => {
    setProductToDelete(product);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setProductToDelete(null);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (!productToDelete) return;

    if (!verifyPassword(deletePassword)) {
      setDeleteError('Senha incorreta! O produto não foi excluído.');
      return;
    }

    try {
      setDeleting(true);
      setDeleteError('');
      await api.deleteProduct(productToDelete.id);
      setSelectedForPoster((prev) =>
        prev.filter((id) => String(id) !== String(productToDelete.id))
      );
      setProductToDelete(null);
      setDeletePassword('');
      fetchProducts();
    } catch (err) {
      setDeleteError('Erro ao excluir o produto. Tente novamente.');
      console.error(err);
    } finally {
      setDeleting(false);
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

        {/* Mobile Product Cards (< md) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {products.map((product) => {
            const isChecked = selectedForPoster.some((id) => String(id) === String(product.id));
            return (
              <div
                key={product.id}
                className={`rounded-xl bg-white p-3.5 shadow border transition ${
                  isChecked ? 'border-rose-500 ring-1 ring-rose-400 bg-rose-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelectProduct(product.id)}
                    aria-label={`Selecionar ${product.nome} para cartaz`}
                    className="h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer shrink-0"
                  />
                  <img
                    src={product.img}
                    alt={product.nome}
                    className="h-14 w-14 object-cover rounded-lg border bg-gray-50 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-gray-400">#{product.id}</span>
                      {product.visivel === false ? (
                        <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                          🚫 Oculto no site
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          👁️ Visível
                        </span>
                      )}
                      {product.featured && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          ★ Destaque
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate">{product.nome}</h3>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs font-extrabold text-rose-600">R$ {product.preco}</span>
                      {product.categoria && (
                        <span className="text-[11px] text-gray-500 truncate ml-2">{product.categoria}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    disabled={togglingId === product.id}
                    onClick={() => handleToggleVisibility(product)}
                    className={`py-2 px-1.5 rounded-lg font-bold text-xs text-center cursor-pointer transition ${
                      product.visivel === false
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        : 'bg-green-50 hover:bg-green-100 text-green-700'
                    }`}
                  >
                    {product.visivel === false ? '🚫 Oculto' : '👁️ Visível'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openPosterForSingleProduct(product.id)}
                    className="py-2 px-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs text-center cursor-pointer"
                  >
                    🎨 Cartaz
                  </button>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="py-2 px-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs text-center"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRequestDelete(product)}
                    className="py-2 px-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs text-center cursor-pointer"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table (>= md) */}
        <div className="hidden md:block bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
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
                    Visível no Site
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          disabled={togglingId === product.id}
                          onClick={() => handleToggleVisibility(product)}
                          title="Clique para alternar se o produto aparece ou não no site"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                            product.visivel === false
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-green-100 hover:bg-green-200 text-green-800'
                          }`}
                        >
                          {product.visivel === false ? '🚫 Oculto' : '👁️ Visível'}
                        </button>
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
                            type="button"
                            onClick={() => handleRequestDelete(product)}
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

      {/* Password Confirmation Modal for Deleting Product */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                🔒 Confirmar Exclusão de Produto
              </h3>
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="text-white/80 hover:text-white text-lg font-bold cursor-pointer"
                aria-label="Fechar modal de exclusão"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDelete} className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-3 rounded-xl">
                {productToDelete.img && (
                  <img
                    src={productToDelete.img}
                    alt={productToDelete.nome}
                    className="w-14 h-14 rounded-lg object-cover border bg-white shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-red-700 font-semibold uppercase">
                    Produto a ser excluído:
                  </p>
                  <p className="text-sm font-extrabold text-gray-900 truncate">
                    {productToDelete.nome}
                  </p>
                  <p className="text-xs text-gray-600">Preço: R$ {productToDelete.preco}</p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="delete-admin-password"
                  className="block text-xs font-bold text-gray-700 uppercase mb-1.5"
                >
                  Digite a senha do Admin para confirmar:
                </label>
                <input
                  id="delete-admin-password"
                  type="password"
                  autoFocus
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    if (deleteError) setDeleteError('');
                  }}
                  placeholder="Sua senha de administrador..."
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                {deleteError && (
                  <p className="mt-2 text-xs font-bold text-red-600">{deleteError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={deleting || !deletePassword}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
                >
                  {deleting ? 'Excluindo...' : '🗑️ Confirmar Exclusão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
