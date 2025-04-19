import { Component, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import {autoTable} from 'jspdf-autotable'
import { ProductsServicesService } from '../products-services.service';
import { Product } from '../models/products.models';

@Component({
  selector: 'app-config-shop',
  imports: [],
  templateUrl: './config-shop.component.html',
  styleUrl: './config-shop.component.css'
})
export class ConfigShopComponent {
  today: Date = new Date()
  date = this.today.toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  productsService = inject(ProductsServicesService);
  datosPDF:any[] = [];
  ventasTotales: number = 0;
  finalY:number = 0;


  ngOnInit(): void {
    this.listProductsSale();
    this.getSales();
  }

  listProductsSale = () =>{
    this.productsService.getProductsDB().subscribe(data => {
      console.log(data);

      data.forEach(element => {
        this.datosPDF.push([element.name,element.stock,element.price])
      });

      console.log(this.datosPDF)
      console.log('Cantidad de fila: ', this.datosPDF.length)
    })
  }

  // Get sale
  getSales = () => {
    this.productsService.getProductsDB().subscribe((products: Product[]) => {
      // Add the sales
      products.forEach((data) => {
        this.ventasTotales += data.price;
      });
    });
  };

  generarPdfConTabla() {
    const doc = new jsPDF();

    const encabezados = [['Producto', 'Cantidad', 'Precio']];
    const text = 'Urban God | Moda del Reino';

    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text,x,10)
    doc.setFontSize(10);
    doc.text(this.date, (textWidth * 2) + 15,5)

    autoTable(doc, {
      head: encabezados,
      body: this.datosPDF,
      startY: 25,
      styles: {
        fontSize: 11,
        textColor: [255, 255, 255],             // Blanco
        fillColor: [20, 20, 30],                // Fondo negro espacial
        lineColor: [255, 0, 144],               // Línea tenue fucsia (opcional)
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [255, 0, 144],               // Fucsia para el encabezado
        textColor: [255, 255, 255],             // Texto blanco
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [25, 25, 35],                // Fondo ligeramente distinto para filas alternas
      },
      margin: { top: 20 },
      didDrawPage: (data) => {
        let finalY:number | undefined = 1
        finalY = data.cursor?.y; // El valor finalY te da la última posición de la tabla
        console.log("Altura calculada de la tabla: ", finalY);
        doc.setFontSize(12);

        const textPosicionText = finalY! + 10;
        doc.text(`Ventas totales: ${this.ventasTotales} $`, x + 35, finalY! + 10);
      }
    });


    doc.save(`historial de ventas del ${this.date}`);
  }

}
