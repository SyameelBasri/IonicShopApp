/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { Product } from '../products/product.model';
import { ProductsService } from '../products/products.service';
import { CartItem } from './cart-item.model';

const DB_URL = 'https://ionic-angular-course-b3fc6-default-rtdb.asia-southeast1.firebasedatabase.app';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cart = new BehaviorSubject<CartItem[]>([]);
  private _itemCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private productsService: ProductsService) { }

  get cart(){
    return this._cart.asObservable();
  }

  get itemCount(){
    return this._itemCount.asObservable();
  }

  addItem(product: Product, quantity: number){
    const newCartItem = new CartItem(product, quantity);
    return this.http
      .put<{item: CartItem}>(DB_URL + `/cart/${product.id}.json`, {...newCartItem, id: product.id})
      .pipe(
        switchMap(() => this.cart), take(1),
        tap(cart => {
          this._cart.next(cart.concat(newCartItem));
          this._itemCount.next(cart.length);
        })
      );
  }

  editItemQuantity(product: Product, quantity: number){
    const updatedCartItem = new CartItem(product, quantity);
    return this.http
      .put<{item: CartItem}>(DB_URL + `/cart/${product.id}.json`, {...updatedCartItem, id: product.id})
      .pipe(
        switchMap(() => this.cart), take(1),
        tap(cart => {
          for(const item of cart){
            if(item.product.id === product.id){
              item.quantity = quantity;
            }
          }
          this._cart.next(cart);
        })
      );
  }

  removeItem(id: string){
    return this.http.delete(
      DB_URL + `/cart/${id}.json`
    ).pipe(
      switchMap(() => this.cart),
      take(1),
      tap(cart => {
        this._cart.next(cart.filter(item => item.product.id !== id));
        this._itemCount.next(cart.length);
      })
    );
  }

  fetchCartItems(){
    return this.http
      .get<{[key: string]: CartItem}>(DB_URL + `/cart.json`)
      .pipe(
        map(cartItemData => {
          const cartItems = [];
          for(const key in cartItemData){
            if(cartItemData.hasOwnProperty(key) && key){
              cartItems.push(
                new CartItem(
                  cartItemData[key].product,
                  cartItemData[key].quantity
                )
              );
            }
          }
          return cartItems;
        }),
        tap(cartItems => {
          this._cart.next(cartItems);
          this._itemCount.next(cartItems.length);
        })
      );
  }

  checkoutItems(){
    return this.http.delete(
      DB_URL + `/cart.json`
    ).pipe(
      switchMap(() => this.cart), take(1),
      tap(cart => {
        this.productsService.updateQuantitySold(cart).subscribe();
        this._cart.next([]);
        this._itemCount.next(0);
      })
    );
  }

  getItemQuantity(id: string){
    return this.http.get<CartItem>(
      DB_URL + `/cart/${id}.json`
    );
  }

}
