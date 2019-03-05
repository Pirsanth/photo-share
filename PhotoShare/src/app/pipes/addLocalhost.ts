import { Pipe, PipeTransform } from "@angular/core";

/*Allows the use of relative imageUrls in the html by prefixing the localhost automatically
*This pipe accepts inputs of the form:
*   image-url
*   ./image-url
*    /image-url
*/

const prefix = "http://localhost:3000/"
const regex = /^((\.\/)|\/)?([\w-@.\/\\]+)/;

@Pipe({name: "addLocalhost"})
export class addLocalhostPipe implements PipeTransform {
  transform(value:string){
    console.log(value)
    const [,,,contents] = value.match(regex)
    return prefix + contents;
  }
}
