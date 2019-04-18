import { Pipe, PipeTransform } from "@angular/core";
import { AlbumsService } from "../services/albums.service"

/*Allows the use of relative imageUrls in the html by prefixing the localhost automatically
*This pipe accepts inputs of the form:
*   image-url
*   ./image-url
*    /image-url
*/

const regex = /^((\.\/)|\/)?(.+)/;

@Pipe({name: "addLocalhost"})
export class addLocalhostPipe implements PipeTransform {
  prefix:string;
  constructor(private ajax:AlbumsService){
    this.prefix = this.ajax.baseURL;
  }

  transform(value:string, additionalPrefix:string = ""){

    if(regex.test(additionalPrefix)){
      [,,,additionalPrefix] = additionalPrefix.match(regex);

      if(!additionalPrefix.endsWith("/")){
        additionalPrefix += "/";
      }
    }

    const [,,,contents] = value.match(regex);
    return this.prefix + "/" + additionalPrefix + contents;
  }
}
