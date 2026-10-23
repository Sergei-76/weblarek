import { ensureElement } from '../../utils/utils';
import { ServiceCart } from './serviceCart';

interface IPreviewCard {
  description: string;
}

interface IClickbutton {
  onAdd?: () => void;
  onRemove?: () => void;
  onClose?: () => void;
}

export class PreviewCard extends ServiceCart<IPreviewCard > {
  
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  private isInBasket: boolean = false;

  constructor( container: HTMLElement,actions?: IClickbutton) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => this.toggleState(actions));
  }

  protected set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  setInBasket(inBasket: boolean) {
    this.isInBasket = inBasket;
    this.updateButtonState();
  }

  setprice(price: number | null) {
    if (price === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Недоступно';
    } else {
      this.buttonElement.disabled = false;
    }
  }

  private toggleState(actions?: IClickbutton): void {

    if (this.buttonElement.disabled) return;

    const wasInBasket = this.isInBasket;
    this.isInBasket = !this.isInBasket;
    this.updateButtonState();

    if (wasInBasket) {
      actions?.onRemove?.();
    } else {
      actions?.onAdd?.();
    }

    actions?.onClose?.();
  }

  private updateButtonState(): void {
    if (this.buttonElement.disabled) {
      return;
    }
    if (this.isInBasket) {
      this.buttonElement.textContent = 'Удалить из корзины';
    } else {
      this.buttonElement.textContent = 'В корзину';
    }
  }
}