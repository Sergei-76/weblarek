import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { TPayment } from '../../types';

interface IOrderForm {
  payment: TPayment | null;
  address: string;
  valid: boolean;
  errors: string; 
}

export class OrderForm extends Component<IOrderForm> {

  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  protected orderButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, protected container: HTMLFormElement) {
    super(container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      '.button_alt',
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

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
      this.events.emit('contacts');
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

  protected set valid(value: boolean) {
    this.orderButton.disabled = !value;
  }

  protected set errors(value: string) {
    this.errorsElement.textContent = value;
    
  }
}