
import { Subject } from "rxjs";
import { take } from "rxjs/operators";

export class AuthModalService {

  private modalResponse: Subject<boolean> = new Subject();
  private openModal: Subject<any> = new Subject();
  openModal$ = this.openModal.asObservable();
  constructor() { }

  emitResponse(response:boolean){
    this.modalResponse.next(response);
  }
  getUserResponse(){
    this.openModal.next(true);

    return this.modalResponse.pipe(
      take(1)
    );
  }
}
