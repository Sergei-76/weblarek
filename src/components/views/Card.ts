import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ICard {
  title: string;
  price: number | null;
}

export abstract class Card<T = object> extends Component<ICard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  protected set title(value: string) {
    this.titleElement.textContent = value;
  }

  protected set price(value: number | null) {
    if (typeof value === 'number') {
      this.priceElement.textContent = `${value} синапсов `
    } else {
      this.priceElement.textContent = 'Бесценно'
    }
  }
}