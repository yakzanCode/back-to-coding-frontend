import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product.model';

@Pipe({
    name: 'filterByCategory',
    standalone: true
})
export class FilterByCategoryPipe implements PipeTransform {
    transform(products: Product[], category: string): Product[] {
        return products.filter(product => product.category === category);
    }
}


// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//     name: 'customPipe'
// })
// export class CustomPipe implements PipeTransform {
//     transform(value: any, ...args: any[]): any {
//         return transformedValue;
//     }
// }

