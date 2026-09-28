import { IApi, IProductList, IOrder, IOrderResult } from '../../types';

export class WebApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductList> {
    return this.api.get<IProductList>('/product/');
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', order);
  }
}