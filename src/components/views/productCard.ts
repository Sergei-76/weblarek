import { ServiceCart } from "./serviceCart";
import { IClickbutton } from "../../types";

export class ProductCard extends ServiceCart {

  constructor(container: HTMLElement, actions?: IClickbutton) {
    super(container);

    if (actions?.onClick) {
      this.container.addEventListener('click',(ev)=>{
        ev.stopPropagation();
        actions.onClick();
      });
    }
  }

}