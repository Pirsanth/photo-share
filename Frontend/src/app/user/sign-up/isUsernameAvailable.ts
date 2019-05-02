import { AsyncValidator, FormControl } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { Injectable } from "@angular/core";
import { timer, of } from "rxjs";
import { switchMap, map, pluck, catchError} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class isUsernameAvailable implements AsyncValidator {
    constructor(private auth: AuthenticationService ){
    }

    validate(control: FormControl){
      return timer(1000).pipe(
        switchMap(() => this.auth.isUsernameAvailable(control.value) ),
        pluck('isAvailable'),
        map( isAvailable => {

            if(isAvailable){
              return null;
            }
            else{
              return {available: true};
            }

        }),
        catchError(err => {
          return of({httpError: true});
        })
      )
    }
}
