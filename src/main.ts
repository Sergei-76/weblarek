import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { IProduct, TPayment, IOrder, IBuyerErrors} from './types';
import { WebApi } from './components/WebApi';

import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Customer } from './components/models/Customer';

import { Modal } from './components/views/modal';
import { Header } from './components/views/header';
import { Gallery } from './components/views/gallery';
import { ProductCard } from './components/views/productCard';
import { BasketCard } from './components/views/basketCard';
import { PreviewCard } from './components/views/previewCard';
import { PreviewBasket } from './components/views/previewBasket';
import { OrderForm } from './components/views/orderForm';
import { ContactForm } from './components/views/contactsForm';
import { SuccessForm } from './components/views/successForm';

const api = new Api(API_URL);
const webApi = new WebApi(api);

const events = new EventEmitter();

const products = new ProductCatalog(events);
const baskets = new Basket(events);
const customers = new Customer(events);

const headers = new Header(ensureElement<HTMLElement>('.header'),events);
const gallerys = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

const previewBaskets = new PreviewBasket(cloneTemplate<HTMLElement>('#basket'),events);
const orderForms = new OrderForm(events, cloneTemplate<HTMLFormElement>('#order'));
const contactForms = new ContactForm(events, cloneTemplate<HTMLFormElement>('#contacts'));
const successForms = new SuccessForm(events, cloneTemplate<HTMLFormElement>('#success'));
const previewCard = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), events);

events.on('catalog:changed', () => {
  const cards = products.getProducts().map((item) =>
     new ProductCard(cloneTemplate<HTMLElement>('#card-catalog'),
     {onClick: () => events.emit('productCard:click', item)}
    ).render({
      category :item.category,
      title :item.title,
      image :item.image,
      price :item.price,
      })
    );
  gallerys.render({ items: cards });
});

events.on('productCard:click',(item: IProduct) => {
  products.setSelectedProduct(item);
});

events.on('productCard', () => {
  
  const item = products.getSelectedProduct();
  if (!item) return;
  const isInBasket = baskets.hasItem(item.id);

  let buttonText: string;
  let disabled = false;

  if (item.price === null) {
    buttonText = 'Недоступно';
    disabled = true;
  } else if (isInBasket) {
    buttonText = 'Удалить из корзины';
    disabled = false;
  } else {
    buttonText = 'В корзину';
    disabled = false;
  }

  const content = previewCard.render({ 
    title: item.title,
    category: item.category,
    description: item.description,
    image: item.image,
    price: item.price,
  });

  previewCard.settextbutton(buttonText);
  previewCard.setdisabled(disabled);
  modal.render({ content });
});

events.on('card:click', () => {
  const item = products.getSelectedProduct();
  if (!item) return;
  const isInBasket = baskets.hasItem(item.id);

  if (isInBasket) {
    baskets.removeItem(item);
    modal.close();
  } else {
    baskets.addItem(item);
    modal.close();
  }
});

events.on('basket:changed', () => {
  if (modal.isOpen()) {
    events.emit('basket:open');
  }
  headers.counter= baskets.getCount();
});

events.on('basket:open', () => {
  const basketCards = baskets.getItems().map((item,i ) =>
    new BasketCard(cloneTemplate<HTMLElement>('#card-basket'),
    {onClick: () => {events.emit('delete', item)}},
  ).render({
    index: i + 1,
    title: item.title,
    price: item.price,
    })
  );
  const container = previewBaskets.render({
    subtotal: baskets.getTotalPrice(),
    containerlist: basketCards,
  });
  previewBaskets.disabled((baskets.getCount() === 0));
  modal.render({ content: container});

});

events.on('delete', (item: IProduct) => {baskets.removeItem(item)});

events.on('order', () => {
  modal.render({ content: orderForms.render() });
});

events.on('order:changed', () => {

  const state = customers.getData();
  const allErrors = customers.validate();
  console.log(state);
  const errors: IBuyerErrors = {};
  if (allErrors.payment) errors.payment = allErrors.payment;
  if (allErrors.address) errors.address = allErrors.address;

  const touched = state.payment !== null || state.address.trim() !== '';

  orderForms.render({
    payment: state.payment,
    address: state.address ?? '',
    valid: Object.keys(errors).length === 0,
    errors: touched ? Object.values(errors).join('; ') : '',
  });
});

events.on('form:order', (data: { field: 'payment' | 'address'; value: string }) => {
  if (data.field === 'payment') {
    customers.saveData({ payment: data.value as TPayment });
  } else {
    customers.saveData({address: data.value});
  }
});

events.on('contactsForm', () => {
  modal.render({ content: contactForms.render() });
});

events.on('contacts:changed', () => {
  const state = customers.getData();
  const errors = customers.validate();
  const touched = state.phone !== '' || state.email !== '';

  contactForms.render({
    email: state.email,
    phone: state.phone,
    valid: Object.keys(errors).length === 0,
    errors: touched ? Object.values(errors).join('; ') : '',
  });
});

events.on('form:contacts', (data: { field: 'phone' | 'email'; value: string }) => {
  if (data.field === 'phone') {
    customers.saveData({ phone: data.value });
  } else {
    customers.saveData({ email: data.value });
  }
});

let isSubmitting = false;

events.on('success:order', async () => {
  if (isSubmitting) return;
  isSubmitting = true;

  const customerData = customers.getData();
  const basketItems = baskets.getItems();

  const errors = customers.validate();
  if (Object.keys(errors).length > 0) {
    events.emit('order:changed');
    isSubmitting = false;
    return;
  };

  try {
    const orderPayload: IOrder = {
      payment: customerData.payment!,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      items: basketItems.map((item) => String(item.id)),
      total: baskets.getTotalPrice(),
    };

    const result = await webApi.orderProducts(orderPayload);

    if (!result || typeof result.id !== 'string') {
      throw new Error('Сервер не вернул корректный ответ заказа');
    };
    
    const finalTotal = typeof result.total === 'number' ? result.total : orderPayload.total;

    customers.clear();
    baskets.clear();

    modal.render({
      content: successForms.render({
        total: finalTotal,
      }),
    });

  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    
  } finally {
    isSubmitting = false;
  }
});



events.on('success:close', () => {
  modal.close();
});

webApi.getProductList()
    .then((response) => { 
        products.saveProducts(response.items);  
    }) 
    .catch((error) => { 
        console.error("Ошибка при получении товаров с сервера: ", error); 
    });