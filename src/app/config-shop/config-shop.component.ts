import { Component, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import {autoTable} from 'jspdf-autotable'
import { ProductsServicesService } from '../products-services.service';

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


  ngOnInit(): void {
    this.listProductsSale();
  }

  listProductsSale = () =>{
    this.productsService.getProductsDB().subscribe(data => {
      console.log(data);

      data.forEach(element => {
        this.datosPDF.push([element.name,element.stock,element.price])
      });

      console.log(this.datosPDF)
    })
  }

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
      margin: { top: 20 }
    });

    doc.save(`historial de ventas del ${this.date}`);
  }

}
