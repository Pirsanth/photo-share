import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthHeaderService } from "./auth-header.service";

export const  httpInterceptors = [
    {provide:HTTP_INTERCEPTORS, useClass:AuthHeaderService, multi:true }
]


//
