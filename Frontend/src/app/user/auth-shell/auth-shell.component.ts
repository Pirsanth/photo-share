import { Component, OnInit } from '@angular/core';
import { AuthModalService } from "../../services/auth-modal.service";
import { FeatureArea } from "../../customTypes";

@Component({
  selector: 'app-auth-shell',
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css'],
  providers: [AuthModalService]
})
export class AuthShellComponent implements OnInit {

  showModal:boolean = false;
  featureArea = FeatureArea.users;
  constructor(private modalService:AuthModalService) { }

  ngOnInit() {

    this.modalService.openModal$.subscribe( () => {
      this.showModal = true;
    })

  }
  emitResponse(response:boolean){
    this.modalService.emitResponse(response);
  }
  closeModal(){
    this.showModal = false;
  }
}
