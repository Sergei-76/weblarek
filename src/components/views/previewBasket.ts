import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IPreviewBasket {
  subtotal: number;
  containerlist: HTMLElement[];
}

export class PreviewBasket extends Component<IPreviewBasket>{

  protected buttonArrangeElement: HTMLButtonElement; 
  protected subtotalElement: HTMLElement;
  protected ulElement: HTMLElement;
  
  constructor( container: HTMLElement, events: IEvents){
    super(container);

    this.buttonArrangeElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.subtotalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.ulElement = ensureElement<HTMLElement>('.basket__list', this.container);

    this.buttonArrangeElement.addEventListener('click', () => events.emit('order'));
  }

  set containerlist (value:HTMLElement[]){
    this.ulElement.innerHTML = '';
    value.forEach(el => this.ulElement.appendChild(el));
  }

  set subtotal (value: number){
    this.subtotalElement.textContent = `${value} синапсов `;
  }

  disabled (value: boolean){
    this.buttonArrangeElement.disabled = value;
  }

}