import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  isLoading = false;
  private productsSub: Subscription;

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.subcribeProducts();
    this.productsService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.isLoading = true;
    this.productsService.fetchProducts().subscribe(() => {
      this.isLoading = false;
    });
  }

  ionViewWillEnter(){
    this.subcribeProducts();
  }

  subcribeProducts(){
    this.productsSub = this.productsService.products.subscribe(products => {
      this.products = products;
    });
  }

  onCategorySelect(){
    this.subcribeProducts();
    if(this.selectedCategory){
      this.products = this.products.filter(p => p.category === this.selectedCategory);
    }
  }

  resetFilter(){
    this.selectedCategory = null;
    this.subcribeProducts();
  }

  ngOnDestroy(): void {
    if(this.productsSub){
      this.productsSub.unsubscribe();
    }
  }

}
