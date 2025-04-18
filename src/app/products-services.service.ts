import { Injectable, inject } from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { Product } from './models/products.models';
import { from } from 'rxjs';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsServicesService {
  private dbService = inject(NgxIndexedDBService);
  constructor() { }

  // Add product to indexedDB
  addProductToDB(product: {
    name?: string;
    stock?: number;
    price?: number;
    imageURL?:string;
  }){
    return this.dbService.add('products',product);
  }

  // Add sale to DB
  addSalesToDB(product: {
    name?:string;
    stock?:number;
    price?:number;
  }){
    return this.dbService.add('sales',product);
  }

  // Add spent to DB
  addSpent(product: {
    name?: string;
    stock?: number;
    price?: number;
  }){
    return this.dbService.add('spent',product);
  }

  // Get all spent
  getSpent(): Observable<any>{
    return this.dbService.getAll('spent');
  }

  // Get all products of sales
  getProductsDB(): Observable<Product[]>{
    return this.dbService.getAll<Product>('sales');
  }

  // Get all products
  getProductsShop():Observable<Product[]>{
    return this.dbService.getAll<Product>('products');
  }

  // Get product by name
  getProductByNameDB(name:string):Observable<any>{
    return this.dbService.getByIndex('products','name',name);
  }

  // Update product
  updateStockByName(name: string, newStock: number, newPrice:number): Observable<any> {
    return from(this.dbService.getByIndex('products', 'name', name)).pipe(
      switchMap((product: any) => {
        if (product) {
          product.stock = newStock;
          product.price = newPrice;
          return from(this.dbService.update('products', product));
        } else {
          throw new Error('Producto no encontrado');
        }
      })
    );
  }
  
}
