import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IPreviewBasket {
  subtotal: number;
  basketlist: HTMLElement[];
}

export class PreviewBasket extends Component<IPreviewBasket>{

  protected buttonArrangeElement: HTMLButtonElement;
  protected subtotalElement: HTMLElement;
  
  constructor( container: HTMLElement, events: IEvents){
    super(container);

    this.buttonArrangeElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.subtotalElement = ensureElement<HTMLElement>('.basket__price', this.container);

    this.buttonArrangeElement.addEventListener('click', () => events.emit('order'));
  }

  protected set subtotal (value: number){
    this.subtotalElement.textContent = `${value} синапсов `;
  }

  disabled (value: boolean){
    this.buttonArrangeElement.disabled = value;
  }

}