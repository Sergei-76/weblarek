import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButtonElement: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected windowElement: HTMLElement;
  private _isOpen: boolean = false;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.windowElement = ensureElement<HTMLElement>('.modal__container', this.container);

    this.closeButtonElement.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.windowElement.addEventListener('click', (event) => event.stopPropagation());
  }

  protected set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this._isOpen = true;
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
    this._isOpen = false;
  }

    isOpen(): boolean {
    return this._isOpen;
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}