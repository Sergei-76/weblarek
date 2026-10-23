import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { IProduct, TPayment} from './types';
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

const orderForms = new OrderForm(events, cloneTemplate<HTMLFormElement>('#order'));
const contactForms = new ContactForm(events, cloneTemplate<HTMLFormElement>('#contacts'));
const successForms = new SuccessForm(events, cloneTemplate<HTMLFormElement>('#success'));

events.on('catalog:changed', () => {
  const cards = products.getProducts().map((item) =>
     new ProductCard(cloneTemplate<HTMLElement>('#card-catalog'),
     {onClick: () => events.emit('productCard', item)}
    ).render({
      category :item.category,
      title :item.title,
      image :item.image,
      price :item.price,
      })
    );
  gallerys.render({ items: cards });
});

events.on('productCard', (item: IProduct) => {
  const previewCard = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview')
    ,{
  onAdd: () => {
    baskets.addItem(item);
  },
  onRemove: () => {
    baskets.removeItem(item);
  },
  onClose: () => {
    modal.close();
  }});

  const content = previewCard.render({
      category :item.category,
      title :item.title,
      description : item.description,
      image :item.image,
      price :item.price,
  });
  previewCard.setprice(item.price);
  previewCard.setInBasket(baskets.hasItem(item.id));
  modal.render({content});
})

events.on('basket:changed', () => {headers.counter= baskets.getCount();})

events.on('basket:open', () => {
  const previewBasket = new PreviewBasket(cloneTemplate<HTMLElement>('#basket'),events);
  const previewBaskets = previewBasket.render({subtotal: baskets.getTotalPrice(),});
  
  previewBasket.disabled((baskets.getCount() === 0));
  gallerys.render({ items: previewBaskets });

  const cardBasket = baskets.getItems().map((item,i ) =>
    new BasketCard(cloneTemplate<HTMLElement>('#card-basket'),
    {onClick: () => {baskets.removeItem(item);events.emit('basket:open')}},
  ).render({
    index: i + 1,
    title: item.title,
    price: item.price,
    })
  );
  const previewCardBasket =  new Gallery(ensureElement<HTMLElement>('.basket__list'));
  previewCardBasket.render({items: cardBasket});
});

events.on('order', () => {
  events.emit('order:changed')
  modal.render({ content: orderForms.render() });
})

events.on('order:changed', () => {
  const state = customers.getData();
  const errors = customers.validateStep1();
  const touched = state.payment !== null || state.address !== '';

  orderForms.render({
    payment: state.payment,
    address: state.address,
    valid: Object.keys(errors).length === 0,
    errors: touched ? Object.values(errors).join('; ') : '',
  });
})

events.on('form:order', (data: { field: 'payment' | 'address'; value: string }) => {
  if (data.field === 'payment') {
    customers.saveData({ payment: data.value as TPayment });
  } else {
    customers.saveData({address: data.value});
  }
})

events.on('contacts', () => {
  events.emit('contacts:changed')
  modal.render({ content: contactForms.render() });
})

events.on('contacts:changed', () => {
  const state = customers.getData();
  const errors = customers.validateStep2();
  const touched = state.phone !== '' || state.email !== '';

  contactForms.render({
    email: state.email,
    phone: state.phone,
    valid: Object.keys(errors).length === 0,
    errors: touched ? Object.values(errors).join('; ') : '',
  });
})

events.on('form:contacts', (data: { field: 'phone' | 'email'; value: string }) => {
  if (data.field === 'phone') {
    customers.saveData({ phone: data.value });
  } else {
    customers.saveData({ email: data.value });
  }
})

events.on('success', () => {
  console.log('Покупатель',customers.getData(),'Заказ',baskets.getItems(),'Итого синапсов',baskets.getTotalPrice() )
  modal.render({ content: successForms.render({
    total: baskets.getTotalPrice(),
  }) });
})

events.on('success:close', () => {

  customers.clear();
  baskets.clear();
  modal.close();
})

webApi.getProductList()
    .then((response) => { 
        products.saveProducts(response.items);  
    }) 
    .catch((error) => { 
        console.error("Ошибка при получении товаров с сервера: ", error); 
    });