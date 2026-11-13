import { supabase } from './supabaseClient';

const HIDDEN_HASH = '#oculto';

const normalizeProduct = (row) => {
  if (!row) return row;
  const rawImg = String(row.img || '');
  const isHiddenByHash = rawImg.endsWith(HIDDEN_HASH);
  const cleanImg = isHiddenByHash ? rawImg.slice(0, -HIDDEN_HASH.length) : rawImg;
  const visivel = typeof row.visivel === 'boolean' ? row.visivel : !isHiddenByHash;

  return {
    ...row,
    img: cleanImg,
    visivel,
  };
};

const prepareProductPayload = (product) => {
  const { visivel = true, ...rest } = product;
  const cleanImg = String(rest.img || '').replace(/#oculto$/, '');
  return {
    ...rest,
    img: visivel === false ? `${cleanImg}${HIDDEN_HASH}` : cleanImg,
  };
};

export const api = {
  getProducts: async ({ includeHidden = false } = {}) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        throw error;
      }

      if (!data) {
        return { data: [] };
      }

      const normalized = data.map(normalizeProduct);
      return {
        data: includeHidden ? normalized : normalized.filter((item) => item.visivel !== false),
      };
    } catch (err) {
      console.error('Unexpected error during product fetch:', err);
      throw err;
    }
  },

  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }

    return { data: normalizeProduct(data) };
  },

  createProduct: async (newProduct) => {
    const payload = prepareProductPayload(newProduct);
    const { data, error } = await supabase
      .from('produtos')
      .insert([payload])
      .select();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return { data: normalizeProduct(data[0]) };
  },

  updateProduct: async (id, updatedProduct) => {
    const payload = prepareProductPayload(updatedProduct);
    const { data, error } = await supabase
      .from('produtos')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }

    return { data: normalizeProduct(data[0]) };
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }

    return { success: true };
  },

  uploadImage: async (file) => {
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      console.error('Supabase Storage Error:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
