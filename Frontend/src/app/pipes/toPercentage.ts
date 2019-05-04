import { Pipe, PipeTransform } from "@angular/core";

//This code is not unused

/*Converts a decimal fraction (0<x<=1) with 2 decimal points into a percentage
*Examples
*    Input 0.99 => Output 99%
*    Input 1.00 => Output 100%
*    Input 0.20 => Output 20%
*/



@Pipe({name: "toPercentage"})
export class toPercentage implements PipeTransform {

  private regexToCheckInput = /^(0\.\d{2}|1\.00)$/;

  constructor(){}
  transform(decimalFraction:string){

    if(this.isRequiredFormat(decimalFraction)){
      console.log(decimalFraction);
      const number = parseFloat(decimalFraction) * 100;
      console.log(number);
      return "21"
    }
    else{
      throw new Error("Wrong input to toPercentage pipe");
    }

  }

  isRequiredFormat(input:string):boolean {
      return this.regexToCheckInput.test(input);
  }
}
