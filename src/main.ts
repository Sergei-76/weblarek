import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { apiProducts } from './utils/data';
import { Basket } from './components/models/Basket';
import { Customer } from './components/models/Customer';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebApi } from './components/models/WebApi';

const catalog = new ProductCatalog();
catalog.saveProducts(apiProducts.items);
console.log('Массив товаров',catalog);

// Проверка getProductById — найден
console.log('товар по id',catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Проверка getProductById — не найден
console.log('не нейден товар',catalog.getProductById('not-exist'));

// Проверка setSelectedProduct + getSelectedProduct
catalog.setSelectedProduct(apiProducts.items[0]);
console.log('id: ..., ...', catalog.getSelectedProduct());

// getSelectedProduct до установки
const freshCatalog = new ProductCatalog();
console.log('getSelectedProduct до установки',freshCatalog.getSelectedProduct());

const basket = new Basket();

// Проверка addItem + getItems
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('Корзина',basket.getItems());

console.log('Количество товаров в корзине',basket.getCount());

console.log('Проверка hasItem — true',basket.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Проверка hasItem — false',basket.hasItem('not-exist'));

basket.removeItem(apiProducts.items[0]);
console.log('Проверка removeItem',basket.getItems()); 
console.log('Проверка removeItem getCount',basket.getCount());

basket.clear();
console.log('Проверка clear',basket.getItems()); 
console.log('Count = 0',basket.getCount());

const customer = new Customer();
console.log('Проверка начального состояния через getData Customer',customer.getData());

customer.saveData({ payment: 'card', address: 'ул. Ленина, 1', email: '', phone: '' });
console.log('Проверка saveData — частичное сохранение (только address)',customer.getData());

customer.saveData({ payment: 'card', address: 'ул. Ленина, 1', email: '', phone: '+79991234567' });
console.log('Сохраняем только phone — address не должен сброситься',customer.getData());

customer.saveData({ payment: 'card', address: 'ул. Ленина, 1', phone: '+79991234567', email: 'test@test.ru' });
console.log('Проверка validate — ошибок быть не должно',customer.validate(customer.getData()));

const emptyBuyer = { payment: '', address: '', phone: '', email: '' };
console.log('Проверка validate — должны быть все ошибки',customer.validate(emptyBuyer));

customer.clear();
console.log('Проверка clear',customer.getData());

const api = new Api(API_URL);
const webApi = new WebApi(api);
const webitem = await webApi.getProductList();
const catalogaip = new ProductCatalog();
catalogaip.saveProducts(webitem.items);
console.log('Массив товаров',catalogaip);
