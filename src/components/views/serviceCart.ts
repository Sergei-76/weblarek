import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from "../../utils/constants";

interface IServiceCart {
  category: string;
  image: string;
}

export abstract class ServiceCart<T = object> extends Card<IServiceCart & T> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
  }

  protected set category(value: string) {
    const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    this.categoryElement.classList.add(modifier);
    this.categoryElement.textContent = value;
  }

  protected set image(value: string) {
    if (value && value.trim() !== '') {
      this.setImage(this.imageElement,CDN_URL + value, 'Изображение товара');
      this.imageElement.hidden = false;
    } else {
      this.imageElement.hidden = true;
    }
  }

}