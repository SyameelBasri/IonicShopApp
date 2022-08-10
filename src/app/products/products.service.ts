/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, Rating } from './product.model';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { CartItem } from '../cart/cart-item.model';

const API_URL = 'https://fakestoreapi.com/products';

interface ProductInterface{
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _products = new BehaviorSubject<Product[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  get products(){
    return this._products.asObservable();
  }

  fetchProducts(){
    return this.http.get<{[id: string]: ProductInterface}>(API_URL)
      .pipe(
        map(resData => {
          const products = [];
          for(const id in resData){
            if(resData.hasOwnProperty(id)){
              products.push(
                new Product(
                  resData[id].id,
                  resData[id].title,
                  resData[id].price,
                  resData[id].description,
                  resData[id].category,
                  resData[id].image,
                  resData[id].rating,
                  (Math.floor(Math.random() * 999) + 1) + resData[id].rating.count
                )
              );
            }
          }
          return products;
        }),
        tap(products => {
          this._products.next(products);
        })
      );
  }

  getProduct(id: string){
    return this.http.get<ProductInterface>(API_URL + `/${id}`)
      .pipe(
        map(productData => new Product(
          id,
          productData.title,
          productData.price,
          productData.description,
          productData.category,
          productData.image,
          productData.rating
        ))
      );
  }

  getCategories(){
    return this.http.get<string[]>(API_URL + '/categories');
  }

  updateQuantitySold(cart: CartItem[]){
    let updatedProducts: Product[];
    return this.products.pipe(
      take(1),
      map(products => {
        for(const item of cart){
          updatedProducts = [...products];
          for(const p of updatedProducts){
            if(p.id.toString() === item.product.id){
              p.quantitySold = +p.quantitySold + +item.quantity;
            }
          }
        }
      }),
      tap(() => {
        this._products.next(updatedProducts);
      })
    );
  }

}
