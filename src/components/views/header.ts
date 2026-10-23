import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: string;
}
export class Header extends Component<IHeader> {
  
  protected basketButtonElement: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents){
    super (container)

    this.basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.basketButtonElement.addEventListener('click', (ev)=> {
      ev.stopPropagation();
      this.events.emit('basket:open');
    })
  }

  set counter(value: number){
    this.counterElement.textContent = String(value);
  }
  
}