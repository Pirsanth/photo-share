import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthHeaderService } from "./auth-header.service";
import { ResendCachedService } from "./resend-cached.service";

export const  httpInterceptors = [
    {provide:HTTP_INTERCEPTORS, useClass:AuthHeaderService, multi:true },
    {provide: HTTP_INTERCEPTORS, useClass: ResendCachedService, multi:true}
]


//
