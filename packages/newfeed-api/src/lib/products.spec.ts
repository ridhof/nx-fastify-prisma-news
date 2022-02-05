import { getProducts } from './products';

describe('productBackend', () => {
  it('should work', async () => {
    const products = await getProducts();
    expect(products.length).toEqual(10);
  });
});
