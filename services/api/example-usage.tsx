/**
 * Example usage of the API error handling system
 * 
 * This file demonstrates how to use the API client and error handling
 * in your React components. Remove this file in production.
 */

"use client";

import React from 'react';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { apiClient } from '@/services/api/client';

// Example 1: Using the useApi hooks
const ExampleComponent1: React.FC = () => {
  const { data, loading, error, execute } = useApiGet<any[]>('/users');

  const handleFetchUsers = async () => {
    await execute();
  };

  return (
    <div>
      <button onClick={handleFetchUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Users'}
      </button>
      {error && <p>Local error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

// Example 2: Direct API client usage
const ExampleComponent2: React.FC = () => {
  const handleApiCalls = async () => {
    try {
      // This will trigger 404 error page
      await apiClient.get('/non-existent-endpoint');
    } catch (error) {
      console.log('Error caught:', error);
    }

    try {
      // This will trigger 403 error page
      await apiClient.get('/admin/protected');
    } catch (error) {
      console.log('Error caught:', error);
    }

    try {
      // This will trigger 500 error page
      await apiClient.post('/users', { invalid: 'data that causes server error' });
    } catch (error) {
      console.log('Error caught:', error);
    }

    try {
      // This will show popup (400 error)
      await apiClient.post('/users', { email: 'invalid-email' });
    } catch (error) {
      console.log('Error caught:', error);
    }
  };

  return (
    <div>
      <button onClick={handleApiCalls}>
        Test Error Handling
      </button>
    </div>
  );
};

// Example 3: Using with form submission
const ExampleForm: React.FC = () => {
  const { loading, execute } = useApiPost('/users');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = Object.fromEntries(formData);
    
    const result = await execute();
    if (result) {
      console.log('User created successfully:', result);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export { ExampleComponent1, ExampleComponent2, ExampleForm };
