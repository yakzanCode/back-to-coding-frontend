import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './Routes/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync()
  ]
};

// import { ApplicationConfig } from '@angular/core';
// import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { provideRouter } from '@angular/router';
// import { routes } from './Routes/app.routes';
// import { AuthInterceptor } from './interceptors/auth.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(),
//     provideRouter(routes),
//     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
//   ],
// };