import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MyFilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'myFilterPipe',
})
export class MyFilterPipe implements PipeTransform {
  /**
   * Takes a value and removes .com from it.
   */
  transform(value: string, ...args) {
    let trimNewsName = value.split(".com", 1);
    //console.log(trimNewsName);
    return trimNewsName;
  }
}
