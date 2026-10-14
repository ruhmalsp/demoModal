import expectedData from '../../../tests/data/demo.json';

export interface DemoTestData {
  productName: string;
  productPrice: string;
  productId: number;
  apiProductTitle: string;
  apiAddedProductTitle: string;
  apiUpdatedProductTitle: string;
  apiPatchedProductTitle: string;
  inventoryTitle: string;
  checkout: {
    firstName: string;
    lastName: string;
    postalCode: string;
  };
  expected: {
    loginError: string;
    lockedLoginError: string;
    checkoutComplete: string;
    minimumProducts: number;
    productCount: number;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDemoTestData(value: unknown): value is DemoTestData {
  if (!isRecord(value) || !isRecord(value.checkout) || !isRecord(value.expected)) return false;

  return typeof value.productName === 'string' &&
    typeof value.productPrice === 'string' &&
    typeof value.productId === 'number' &&
    Number.isInteger(value.productId) &&
    typeof value.apiProductTitle === 'string' &&
    typeof value.apiAddedProductTitle === 'string' &&
    typeof value.apiUpdatedProductTitle === 'string' &&
    typeof value.apiPatchedProductTitle === 'string' &&
    typeof value.inventoryTitle === 'string' &&
    typeof value.checkout.firstName === 'string' &&
    typeof value.checkout.lastName === 'string' &&
    typeof value.checkout.postalCode === 'string' &&
    typeof value.expected.loginError === 'string' &&
    typeof value.expected.lockedLoginError === 'string' &&
    typeof value.expected.checkoutComplete === 'string' &&
    typeof value.expected.minimumProducts === 'number' &&
    Number.isInteger(value.expected.minimumProducts) &&
    typeof value.expected.productCount === 'number' &&
    Number.isInteger(value.expected.productCount);
}

const rawTestData: unknown = expectedData;
if (!isDemoTestData(rawTestData)) {
  throw new Error('tests/data/demo.json does not match the approved demo test-data shape.');
}

export const testData: DemoTestData = rawTestData;
