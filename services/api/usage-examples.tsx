/**
 * Examples showing how to use API calls in both Server and Client Components
 */

import { fetchData, serverApiClient } from './server';
import { useApiGet } from '@/hooks/useApi';

// ===== SERVER COMPONENT EXAMPLES =====

// Example 1: Server Component with fetchData helper
async function ProductsServerComponent() {
  const products = await fetchData<Product[]>('/v1/products');

  if (!products) {
    return <div>Failed to load products</div>;
  }

  return (
    <div>
      <h1>Products (Server Component)</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// Example 2: Server Component with direct serverApiClient usage
async function ProductDetailsServerComponent({ id }: { id: string }) {
  try {
    const response = await serverApiClient.get<Product>(`/v1/products/${id}`);
    const product = response.data;

    return (
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
      </div>
    );
  } catch (error) {
    // Error will be logged on server, return fallback UI
    return <div>Product not found or server error</div>;
  }
}

// Example 3: Server Action
async function createProduct(formData: FormData) {
  'use server';

  const productData = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
  };

  try {
    const response = await serverApiClient.post<Product>('/v1/products', productData);
    console.log('Product created:', response.data);
    // redirect or revalidate as needed
  } catch (error) {
    console.error('Failed to create product:', error);
    throw new Error('Failed to create product');
  }
}

// ===== CLIENT COMPONENT EXAMPLES =====

// Example 4: Client Component with useApiGet hook
'use client';
function ProductsClientComponent() {
  const { data: products, loading, error, execute } = useApiGet<Product[]>('/v1/products');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products (Client Component)</h1>
      <button onClick={execute}>Refresh</button>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// Example 5: Client Component with manual API calls
'use client';
import { apiClient } from './client';
import { useState } from 'react';

function ProductFormClientComponent() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const productData = Object.fromEntries(formData);
      
      // This will automatically handle errors through error boundary
      await apiClient.post('/v1/products', productData);
      
      // Success - form will be reset or redirect handled by parent
    } catch (error) {
      // Error is automatically handled by error boundary system
      console.log('Error caught:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Product name" required />
      <input name="price" type="number" placeholder="Price" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}

// Type definitions (move to separate types file in real app)
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export {
  ProductsServerComponent,
  ProductDetailsServerComponent,
  createProduct,
  ProductsClientComponent,
  ProductFormClientComponent,
};
