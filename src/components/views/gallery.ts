import { Component } from "../base/Component";

interface IGallery {
  items: HTMLElement[] | HTMLElement;
}
export class Gallery extends Component<IGallery> {

  constructor( container: HTMLElement){
    super (container);
  }

  protected set items(items: HTMLElement[] | HTMLElement){
    const list = Array.isArray(items) ? items : [items];
    this.container.replaceChildren(...list);
  }

}