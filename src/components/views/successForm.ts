import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

interface ISuccessForm{
  total: number;
}

export class SuccessForm extends Component<ISuccessForm> {
  protected successButton: HTMLButtonElement;
  protected totalElement: HTMLElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);

    this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.successButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('success:close');
    });
  }

  protected set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов` ;
  }
}