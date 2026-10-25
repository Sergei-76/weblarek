import { ensureAllElements } from '../../utils/utils';
import { ServiceForm } from './serviceForm';
import type { IEvents } from '../base/Events';

interface IContactForm {
  email: string;
  phone: string;
}

export class ContactForm extends ServiceForm<IContactForm> {
  protected contactsInput: HTMLInputElement[];

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container, '.button');

    this.contactsInput = ensureAllElements<HTMLInputElement>('.form__input', this.container);
   
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
      this.events.emit('success:order');
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

}