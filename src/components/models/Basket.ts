import { IProduct } from "../../types";
import { IEvents} from "../base/Events";

export class Basket {
  private items: IProduct[];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:open');
    this.events.emit('basket:changed');
  }

  getTotalPrice(): number {
    
    return this.items.reduce(
      (sum, item) => sum + (typeof item.price === 'number' ? item.price : 0),
      0
    );
    
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}