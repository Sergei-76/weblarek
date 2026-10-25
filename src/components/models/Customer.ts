import { IBuyer, TPayment, IBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Customer {
  private payment: TPayment | null;
  private address: string;
  private phone: string;
  private email: string;

  constructor(protected events: IEvents) {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  /** Сохранение данных — можно передать любое подмножество полей */
  saveData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {this.payment = data.payment; this.events.emit('order:changed');};
    if (data.address !== undefined) {this.address = data.address; this.events.emit('order:changed');};
    if (data.phone !== undefined) {this.phone = data.phone; this.events.emit('contacts:changed');}
    if (data.email !== undefined) {this.email = data.email; this.events.emit('contacts:changed');}
  }

  /** Получение всех данных покупателя */
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  /** Очистка данных покупателя */
  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('order:changed')
    this.events.emit('contacts:changed');
  }

  validate():IBuyerErrors{
    const errors: IBuyerErrors = {};

    if (this.payment === null) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.address?.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.phone?.trim()) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.email?.trim()) {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}