import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from '../common/api/BaseApiClient';

export class ProductsApi {
  constructor(private readonly client: BaseApiClient) {}

  list(): Promise<APIResponse> {
    return this.client.get('/products');
  }

  get(id: number): Promise<APIResponse> {
    return this.client.get(`/products/${id}`);
  }

  add(title: string): Promise<APIResponse> {
    return this.client.post('/products/add', { title });
  }

  replace(id: number, title: string): Promise<APIResponse> {
    return this.client.put(`/products/${id}`, { title });
  }

  update(id: number, title: string): Promise<APIResponse> {
    return this.client.patch(`/products/${id}`, { title });
  }

  remove(id: number): Promise<APIResponse> {
    return this.client.delete(`/products/${id}`);
  }
}
