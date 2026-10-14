export interface Product {
  id: number;
  title: string;
}

export interface ProductList {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export function parseProduct(value: unknown): Product {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value) ||
    typeof value.id !== 'number' ||
    !('title' in value) ||
    typeof value.title !== 'string'
  ) {
    throw new Error('DummyJSON product response did not match the expected product contract.');
  }
  return { id: value.id, title: value.title };
}

export function parseProductList(value: unknown): ProductList {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('products' in value) ||
    !Array.isArray(value.products) ||
    !('total' in value) ||
    typeof value.total !== 'number' ||
    !('skip' in value) ||
    typeof value.skip !== 'number' ||
    !('limit' in value) ||
    typeof value.limit !== 'number'
  ) {
    throw new Error('DummyJSON list response did not match the expected catalog contract.');
  }
  return {
    products: value.products.map(parseProduct),
    total: value.total,
    skip: value.skip,
    limit: value.limit
  };
}
