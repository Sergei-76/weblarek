import { ensureElement } from '../../utils/utils';
import { ServiceCart } from './serviceCart';
import { IEvents } from '../base/Events';

interface IPreviewCard {
  description: string;
}


export class PreviewCard extends ServiceCart<IPreviewCard> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      if (this.buttonElement.disabled) return;
      events.emit('card:click');
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  settextbutton(text: string) {
    this.buttonElement.textContent = text;
  }

  setdisabled(disabled: boolean) {
    this.buttonElement.disabled = disabled;
  }
}