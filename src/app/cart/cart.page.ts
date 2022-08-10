import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CartItem } from './cart-item.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cart: CartItem[];
  isLoading = false;
  totalPrice = '';
  private cartSub: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe(cart => {
      this.cart = cart;
      this.totalPrice = this.calculateTotal();
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.cartService.fetchCartItems().subscribe(() => {
      this.isLoading = false;
    });
  }

  calculateTotal(){
    let total = 0;
    for(const item of this.cart){
      const itemPrice = item.product.price * item.quantity;
      total += itemPrice;
    }
    return total.toFixed(2);
  }

  onItemRemove(id: string){
    this.cartService.removeItem(id).subscribe();
  }

  onCheckout(){
    this.loadingController.create({
      message: 'Checkout...'
    }).then(loadingEl => {
      loadingEl.present();
      this.cartService.checkoutItems().subscribe(() => {
        loadingEl.dismiss();
        this.router.navigate(['/products']);
      });
    });
  }

  ngOnDestroy(): void {
    if(this.cartSub){
      this.cartSub.unsubscribe();
    }
  }

}
