import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: URLSearchParams | Record<string, string | number | boolean>;
  timeout?: number;
  failOnStatusCode?: boolean;
}

export class BaseApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  get(path: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.get(this.resolvePath(path), { ...options, maxRedirects: 0 });
  }

  post(path: string, data: unknown, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.post(this.resolvePath(path), { ...options, data, maxRedirects: 0 });
  }

  put(path: string, data: unknown, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.put(this.resolvePath(path), { ...options, data, maxRedirects: 0 });
  }

  patch(path: string, data: unknown, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.patch(this.resolvePath(path), { ...options, data, maxRedirects: 0 });
  }

  delete(path: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.delete(this.resolvePath(path), { ...options, maxRedirects: 0 });
  }

  private resolvePath(path: string): string {
    const target = new URL(path, `${this.baseUrl}/`);
    if (target.origin !== new URL(this.baseUrl).origin || !target.pathname.startsWith('/')) {
      throw new Error('API requests must remain on the configured same-origin API host.');
    }
    return target.toString();
  }
}
