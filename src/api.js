import { supabase } from './supabaseClient';

export const api = {
  getProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*');

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        throw error;
      }

      if (!data) {
        return { data: [] };
      }

      return { data };
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

    return { data };
  },

  createProduct: async (newProduct) => {
    const { data, error } = await supabase
      .from('produtos')
      .insert([newProduct])
      .select();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return { data: data[0] };
  },

  updateProduct: async (id, updatedProduct) => {
    const { data, error } = await supabase
      .from('produtos')
      .update(updatedProduct)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }

    return { data: data[0] };
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
