import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsServicesService } from '../products-services.service';
import { Product } from '../models/products.models';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  ngOnInit(): void {
    this.getSales();
    this.obtainingProducts();
    this.getSpent();
  }

  private productServices = inject(ProductsServicesService);

  mostrarProduct: boolean = false;
  showSale: boolean = false;
  showSpent: boolean = false;
  ventasTotales: number = 0;

  // Spent values
  spent = {};
  totalSpent: number = 0;
  balance: number = 0;

  // Values of Sales
  selectedProduct: string = '';
  stockProduct?: number | null;
  priceProduct?: number | null;
  nameProduct?: string | null;

  productsShop: any[] = [];
  saleProductShop: any[] = [];
  listProduct = {};

  // Values of products
  productNameAdd?: string | null;
  stockProductAdd?: number | null;
  priceProductAdd?: number | null;
  newStock: number = 0;
  limitStock: number = 0;

  // Products of sales modal
  productos: any[] = [];

  // Balance
  calculateBalance = () => {
    this.balance = this.ventasTotales - this.totalSpent;
  };

  // add spent to dataBase
  addSpent = () => {
    if (
      this.nameProduct == null ||
      this.stockProduct == null ||
      this.priceProduct == null
    ) {
      alert('Rellena todos los campos por favor');
      return;
    }
    this.spent = {
      name: this.nameProduct,
      stock: this.stockProduct,
      price: this.priceProduct,
    };
    this.productServices.addSpent(this.spent).subscribe(() => {
      console.log('Se ga hecho un gasto');
      this.cleanForm();
      this.getSpent();
    });
  };

  // Obtaining spents
  getSpent = () => {
    this.totalSpent = 0;
    this.productServices.getSpent().subscribe((data) => {
      data.forEach((item: any) => {
        this.totalSpent += item.price;
      });
      this.calculateBalance();
    });
  };

  // Obtaining products
  obtainingProducts = () => {
    this.productServices.getProductsShop().subscribe((data) => {
      this.productos = [];
      this.productsShop = this.obtainingProductLow(data).slice(0, 3);
      data.forEach((item) => {
        this.productos.push(item.name);
      });

      console.log(this.productos);
    });
  };

  obtainingProductLow = (data: Product[]) => {
    data.sort((a, b) => a.stock - b.stock);
    return data;
  };

  // Add products to DataBase
  saveProducts = () => {
    if (
      this.productNameAdd == null ||
      this.stockProductAdd == null ||
      this.priceProductAdd == null
    ) {
      alert('Rellena todos los campos por favor');
      return;
    }
    console.log(this.productNameAdd.trim());
    console.log(this.stockProductAdd);
    console.log(this.priceProductAdd);

    this.listProduct = {
      name: this.productNameAdd.trim(),
      stock: this.stockProductAdd,
      price: this.priceProductAdd,
    };

    this.productServices
      .getProductByNameDB(this.productNameAdd.trim())
      .subscribe((existingProduct) => {
        // Checking if exist product
        if (
          existingProduct &&
          this.productNameAdd?.trim() &&
          this.stockProductAdd &&
          this.priceProductAdd
        ) {
          // Ask if the user will update the stock (Add)
          let result = confirm(
            'Se va a actualizar el producto ¿desea continuar?'
          );

          if (result) {
            this.newStock = existingProduct.stock + this.stockProductAdd;
            this.productServices
              .updateStockByName(
                this.productNameAdd!.trim(),
                this.newStock,
                this.priceProductAdd!
              )
              .subscribe({
                next: () => {
                  alert('Producto actualizado correctamente');
                  this.obtainingProducts();
                  this.cleanForm();
                },
                error: (err) => {
                  alert('Error al actualizar el producto');
                  console.log('error: ', err);
                },
              });
          } else {
            alert('No se puede agregar un producto duplicado');
            this.cleanForm();
            return;
          }
        } else {
          this.productServices
            .addProductToDB(this.listProduct)
            .subscribe(() => {
              console.log(`Productos registrados: ${this.listProduct}`);
              this.obtainingProducts();
              // Limpiando campos
              this.cleanForm();
            });
        }
      });
  };

  // swipe Spent
  showSpentModal = () => {
    this.showSale = false;
    this.showSpent = true;
    this.cleanForm();
    console.log('Presionado');
  };

  // swipe sale
  showSaleModal = () => {
    this.showSpent = false;
    this.showSale = true;
    this.cleanForm();
  };

  // Add Sale to object
  addSale = () => {
    this.productServices
      .getProductByNameDB(this.selectedProduct)
      .subscribe((product) => {
        this.limitStock = product.stock;
      });

    // add condition for limite stockProduct
    if (
      !this.selectedProduct ||
      this.stockProduct == null ||
      this.priceProduct == null
    ) {
      alert('Rellena todos los campos, por favor ');
      return;
    }

    // Checking exist product in stock
    if (this.limitStock > 0) {
      // add product to object
      this.listProduct = {
        name: this.selectedProduct,
        stock: this.stockProduct,
        price: this.priceProduct,
      };

      // add product to list
      this.saleProductShop.push(this.listProduct);

      console.log(this.saleProductShop);
      console.log(this.saleProductShop[0]);

      // Updating stock
      let otherStock = this.stockProduct;

      this.productServices
        .getProductByNameDB(this.selectedProduct)
        .subscribe((data) => {
          this.newStock = data.stock - otherStock;

          console.log('Viejo stock: ', data.stock);

          this.productServices
            .updateStockByName(this.selectedProduct, this.newStock, data.price)
            .subscribe((data) => {
              console.log('Nuevo stock: ', data);
            });
        });

      // Add Sale to dataBase
      this.productServices.addSalesToDB(this.listProduct).subscribe(() => {
        console.log('Productos guardados y actualizados correctamente');
        this.cleanForm();
        this.getSales();
        this.showSale = false;
      });
    }else{
      alert('No hay suficiente unidades del producto a vender');
      this.cleanForm();
    }
  };

  cleanForm = () => {
    this.selectedProduct = '';
    this.nameProduct = null;
    this.stockProduct = null;
    this.priceProduct = null;
    this.productNameAdd = null;
    this.priceProductAdd = null;
    this.stockProductAdd = null;
  };

  // Show modal add product
  addProduct = () => {
    this.mostrarProduct = !this.mostrarProduct;
  };

  // Show modal Sale
  sale = () => {
    this.showSale = !this.showSale;
  };

  // Get sale
  getSales = () => {
    this.ventasTotales = 0;
    this.productServices.getProductsDB().subscribe((products: Product[]) => {
      // Add the sales
      products.forEach((data) => {
        this.ventasTotales += data.price;
      });
      this.calculateBalance();
    });
  };

  // Exit windows of modal
  exit = () => {
    this.mostrarProduct = false;
    this.showSale = false;
    this.showSpent = false;
    this.cleanForm();
  };
}
