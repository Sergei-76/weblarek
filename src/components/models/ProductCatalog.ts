import { IProduct } from "../../types";

export class ProductCatalog{
   private products:IProduct[];
   private selectedProduct: IProduct | null = null;

  constructor(){
    this.products = [];
  }

  // Сохранение массива товаров 
  saveProducts(products: IProduct[]): void {
    this.products = products;
  }

  // Получение массива товаров
  getProducts(): IProduct[] {
    return this.products;
  }

  // Получение одного товара по id
  getProductById(id: string): IProduct | null {
    return this.products.find(p => p.id === id) ?? null;
  }

  // Сохранение товара для подробного отображения
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  // Получение товара для подробного отображения 
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}