import {  ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IServiceForm {
  valid: boolean;
  errors: string; 
}

export abstract class ServiceForm<T = object> extends Component<IServiceForm & T> {
  protected submitButton?: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    protected container: HTMLElement,submitButtonSelector: string | null = null) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    if (submitButtonSelector) {
      const btn = this.container.querySelector<HTMLButtonElement>(submitButtonSelector);
      if (btn) {
        this.submitButton = btn;
      } else {
        console.warn(`Кнопка по селектору "${submitButtonSelector}" не найдена в ${this.container.id || 'контейнере'}`);
      }
    }
  }

  protected set valid(value: boolean) {
    if (!this.submitButton) return;
    this.submitButton.disabled = !value;
  }

  protected set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}