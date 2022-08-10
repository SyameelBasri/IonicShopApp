import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit{
  product: Product;
  isLoading = false;
  quantity = 0;
  cartItemCount: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private productsService: ProductsService,
    private cartService: CartService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('productId')){
        this.navController.navigateBack('/products');
      }
      this.isLoading = true;
      this.productsService.getProduct(paramMap.get('productId')).subscribe(product => {
        this.product = product;
        this.cartService.getItemQuantity(this.product.id).subscribe(item => {
          if(item){
            this.quantity = item.quantity;
          }
        });
        this.isLoading = false;
      }, error => {
        this.alertController.create({
          header: 'An error occured!',
          message: 'This Item could not be fetch. Try again later',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/products']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  addQuantity(){
    this.quantity++;
  }

  removeQuantity(){
    this.quantity--;
  }

  onQuantityInput(ev){
    this.quantity = ev.detail.value;
  }

  addToCart(){
    this.loadingController.create({
      message: 'Add to Cart...'
    }).then(loadingEl => {
      loadingEl.present();
      this.cartService.addItem(this.product, this.quantity).subscribe(() => {
        console.log('item added');
        loadingEl.dismiss();
      });
    });
  }
}
