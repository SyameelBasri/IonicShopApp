import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from '../cart-item.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
  @Input() item: CartItem;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {}

  addQuantity(){
    this.item.quantity++;
    this.cartService.editItemQuantity(this.item.product, this.item.quantity).subscribe();
  }

  removeQuantity(){
    this.item.quantity--;
    this.cartService.editItemQuantity(this.item.product, this.item.quantity).subscribe();
  }

  onQuantityInput(ev){
    this.item.quantity = ev.detail.value;
    this.cartService.editItemQuantity(this.item.product, this.item.quantity).subscribe();
  }

}
