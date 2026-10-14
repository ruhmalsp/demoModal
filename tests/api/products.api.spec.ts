import { test, expect } from '../../src/common/fixtures/test.fixture';
import { parseProduct, parseProductList } from '../../src/services/contracts';

test.describe('DummyJSON products API', () => {
  test('@smoke @regression @api product catalog returns a valid response', async ({ productsApi, testData }) => {
    const response = await productsApi.list();
    expect(response.status()).toBe(200);
    const products = parseProductList(await response.json());
    expect(products.products.length).toBeGreaterThanOrEqual(testData.expected.minimumProducts);
  });

  test('@smoke @regression @api product details match approved data', async ({ productsApi, testData }) => {
    const response = await productsApi.get(testData.productId);
    expect(response.status()).toBe(200);
    const product = parseProduct(await response.json());
    expect(product.title).toBe(testData.apiProductTitle);
  });

  test('@regression @api add endpoint simulates a product response', async ({ productsApi, testData }) => {
    const response = await productsApi.add(testData.apiAddedProductTitle);
    expect(response.status()).toBe(201);
    expect(parseProduct(await response.json()).title).toBe(testData.apiAddedProductTitle);
  });

  test('@regression @api put endpoint simulates a product replacement', async ({ productsApi, testData }) => {
    const response = await productsApi.replace(testData.productId, testData.apiUpdatedProductTitle);
    expect(response.status()).toBe(200);
    expect(parseProduct(await response.json()).title).toBe(testData.apiUpdatedProductTitle);
  });

  test('@regression @api patch endpoint simulates a partial product update', async ({ productsApi, testData }) => {
    const response = await productsApi.update(testData.productId, testData.apiPatchedProductTitle);
    expect(response.status()).toBe(200);
    expect(parseProduct(await response.json()).title).toBe(testData.apiPatchedProductTitle);
  });

  test('@regression @api delete endpoint simulates a deleted product response', async ({ productsApi, testData }) => {
    const response = await productsApi.remove(testData.productId);
    expect(response.status()).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({ id: testData.productId, isDeleted: true });
  });

  test('@regression @negative @api unknown product returns not found', async ({ productsApi }) => {
    const response = await productsApi.get(0);
    expect(response.status()).toBe(404);
  });
});
