import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

interface IContactForm {
  email: string;
  phone: string;
  valid: boolean;
  errors: string; 
}

export class ContactForm extends Component<IContactForm> {
  protected contactsInput: HTMLInputElement[];
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);

    this.contactsInput = ensureAllElements<HTMLInputElement>('.form__input', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.contactsInput.forEach((input) => {
      input.addEventListener('input', () => {
        this.events.emit('form:contacts', {
          field: input.name as 'phone' | 'email',
          value: input.value.trim(),
        });
      });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('success');
    });
  }

  protected set phone(value: string) {
    const input = this.contactsInput.find((el) => el.name === 'phone');
    if (input) input.value = value;
  }

  protected set email(value: string) {
    const input = this.contactsInput.find((el) => el.name === 'email');
    if (input) input.value = value;
  }

  protected set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  protected set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}