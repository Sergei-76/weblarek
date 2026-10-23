import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IClickbutton } from "../../types";

interface IBasketCard {
  index: number;
}

export class BasketCard extends Card <IBasketCard> {
  
  protected indexElement: HTMLElement;
  protected deletebuttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IClickbutton) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deletebuttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    if (actions?.onClick){
      this.deletebuttonElement.addEventListener('click', actions.onClick)
    }
  }

  protected set index (value: number){
    this.indexElement.textContent = `${value}`;
  }

}