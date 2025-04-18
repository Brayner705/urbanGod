import { Component, inject } from '@angular/core';
import { ProductsServicesService } from '../products-services.service';
import { Product } from '../models/products.models';

@Component({
  selector: 'app-accounting',
  imports: [],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css',
})
export class AccountingComponent {
  private productService = inject(ProductsServicesService);
  textHistorial: string = '';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProducts();
    this.getSales()
  }

  listProduct: Product[] = [];
  ventasTotales: number = 0;

  // Geting day
  today: Date = new Date();
  date = this.today.toLocaleDateString('es-VE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Geting historial products
  getProducts() {
    this.productService.getProductsDB().subscribe((products: Product[]) => {
      this.listProduct = products;
    });
  }

  // Get sale
  getSales = () => {
    this.productService.getProductsDB().subscribe((products: Product[]) => {
      // Add the sales
      products.forEach((data) => {
        this.ventasTotales += data.price;
      });
    });
  };
}
