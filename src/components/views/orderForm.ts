import { ensureAllElements, ensureElement } from '../../utils/utils';
import { ServiceForm } from './serviceForm';
import type { IEvents } from '../base/Events';
import type { TPayment } from '../../types';

interface IOrderForm {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends ServiceForm<IOrderForm> {

  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(protected events: IEvents, protected container: HTMLFormElement) {
    super(container, '.order__button');

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt',this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);
    
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.events.emit('form:order', { field: 'payment', value: button.name });
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:order', {
        field: 'address',
        value: this.addressInput.value,
      });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contactsForm');
    });
  }

  protected set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt', button.name === value);
    });
  }

  protected set address(value: string) {
    this.addressInput.value = value;
  }
}