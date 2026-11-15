import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

const normalizeCategory = (value) => String(value || '').trim().replace(/\s+/g, ' ');
const categoryKey = (value) => normalizeCategory(value).toLocaleLowerCase('pt-BR');

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [product, setProduct] = useState({
    nome: '',
    img: '',
    featured: false,
    visivel: true,
    descricao: '',
    preco: '',
    categoria: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const selectedCategory = categories.find((category) => categoryKey(category) === categoryKey(product.categoria)) || product.categoria;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getProducts({ includeHidden: true });
        const uniqueCategories = new Map();
        response.data.forEach(({ categoria }) => {
          const name = normalizeCategory(categoria);
          if (name && !uniqueCategories.has(categoryKey(name))) uniqueCategories.set(categoryKey(name), name);
        });
        setCategories([...uniqueCategories.values()].sort((a, b) => a.localeCompare(b, 'pt-BR')));
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await api.getProductById(id);
          setProduct(prev => ({...prev, ...response.data}));
        } catch (err) {
          setError('Failed to fetch product for editing.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await api.uploadImage(file);
      setProduct((prev) => ({ ...prev, img: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Erro ao enviar imagem: ${error.message || 'Verifique se o bucket "images" existe no Supabase.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.img) {
      setError('Por favor, adicione uma imagem (Upload ou URL).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const requestedCategory = normalizeCategory(creatingCategory ? newCategory : product.categoria);
      const existingCategory = categories.find((category) => categoryKey(category) === categoryKey(requestedCategory));
      const productToSave = { ...product, categoria: existingCategory || requestedCategory };
      if (creatingCategory && !requestedCategory) {
        setError('Informe o nome da nova categoria.');
        setLoading(false);
        return;
      }
      if (isEditing) {
        await api.updateProduct(id, productToSave);
      } else {
        await api.createProduct(productToSave);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === '22001') {
        setError('Erro: O texto é muito longo para o banco de dados (limite de 255 caracteres). Verifique a descrição ou a URL da imagem.');
      } else {
        setError(`Falha ao ${isEditing ? 'atualizar' : 'criar'} produto: ${err.message || 'Erro desconhecido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
              Nome do Produto
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={product.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Imagem do Produto
            </label>
            {product.img && (
              <img
                src={product.img}
                alt="Preview"
                className="mb-3 h-40 w-auto object-contain rounded border bg-gray-50"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
            />
            {uploading && <p className="text-sm text-blue-500 mb-2">Uploading image...</p>}
            <input
              type="text"
              id="img"
              name="img"
              placeholder="Ou cole a URL da imagem aqui"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={product.img}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={product.descricao}
              onChange={handleChange}
              required
            ></textarea>
            <p className="text-xs text-right mt-1 text-gray-500">
              {product.descricao.length} caracteres
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preco">
              Preço
            </label>
            <input
              type="text"
              id="preco"
              name="preco"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={product.preco}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={creatingCategory ? '__new__' : selectedCategory}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  setCreatingCategory(true);
                  setNewCategory('');
                } else {
                  setCreatingCategory(false);
                  setProduct((prev) => ({ ...prev, categoria: e.target.value }));
                }
              }}
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => <option key={categoryKey(category)} value={category}>{category}</option>)}
              <option value="__new__">+ Criar nova categoria</option>
            </select>
            {creatingCategory && (
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nome da nova categoria"
                maxLength={100}
                autoFocus
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
            <p className="mt-1 text-xs text-gray-500">Use uma categoria existente para manter os produtos agrupados com o mesmo nome.</p>
          </div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer" htmlFor="visivel">
              <input
                type="checkbox"
                id="visivel"
                name="visivel"
                className="mr-2 leading-tight h-4 w-4 accent-green-600"
                checked={product.visivel !== false}
                onChange={handleChange}
              />
              <span className="font-semibold">
                {product.visivel !== false ? '👁️ Produto Visível no Site' : '🚫 Produto Oculto no Site'}
              </span>
            </label>

            <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer" htmlFor="featured">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                className="mr-2 leading-tight h-4 w-4 accent-rose-600"
                checked={product.featured}
                onChange={handleChange}
              />
              <span>Produto em Destaque</span>
            </label>
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Produto' : 'Adicionar Produto')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
