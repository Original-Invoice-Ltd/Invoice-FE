interface Product {
  id: string;
  itemName: string;
  category: string;
  description?: string;
  quantity?: number;
  rate?: number;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

class ProductCache {
  private products: Product[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  setProducts(products: Product[]) {
    this.products = products;
    this.lastFetch = Date.now();
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  updateProduct(updatedProduct: Product) {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }

  removeProduct(productId: string) {
    this.products = this.products.filter(p => p.id !== productId);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByIds(ids: string[]): Product[] {
    return this.products.filter(p => ids.includes(p.id));
  }

  isCacheValid(): boolean {
    return Date.now() - this.lastFetch < this.CACHE_DURATION;
  }

  invalidateCache() {
    this.lastFetch = 0;
  }

  clear() {
    this.products = [];
    this.lastFetch = 0;
  }
}

export const productCache = new ProductCache();
export type { Product };