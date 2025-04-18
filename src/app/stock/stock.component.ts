import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProductsServicesService } from '../products-services.service';

@Component({
  selector: 'app-stock',
  imports: [],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {

  ngOnInit(): void {
    this.getProducts()
  }

  @ViewChild('container') containerRef!: ElementRef;

  isLoaded:boolean = false

  productServices = inject(ProductsServicesService);

  listProducts: any[] = []

  // Obtaining products
  getProducts = () =>{
    this.productServices.getProductsShop().subscribe(data => {
      this.isLoaded = true
      this.listProducts = data

    })

  }

}
