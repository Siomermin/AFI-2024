import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agruparProductos'
})
export class AgruparProductosPipe implements PipeTransform {

  transform(items: any[]): string {
    const agrupados = items.reduce((acc, item) => {
      if (acc[item]) {
        acc[item]++;
      } else {
        acc[item] = 1;
      }
      return acc;
    }, {});

    return Object.keys(agrupados).map(key => `${agrupados[key]}x ${key}`).join(', ');
  }

}
