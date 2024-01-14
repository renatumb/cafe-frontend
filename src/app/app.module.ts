import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module';
import { HomeComponent } from './home/home.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import {NgxUiLoaderConfig, NgxUiLoaderModule} from 'ngx-ui-loader';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import {TokenInterceptorInterceptor} from './services/token-interceptor.interceptor';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#6600ff',
  bgsOpacity: 1,
  bgsPosition: 'top-center',
  bgsSize: 140,
  bgsType: 'chasing-dots',
  blur: 0,
  delay: 0,
  fastFadeOut: true,
  fgsColor: '#6600ff',
  fgsPosition: 'center-center',
  fgsSize: 40,
  fgsType: 'cube-grid',
  gap: 78,
  logoPosition: 'center-center',
  logoSize: 100,
  logoUrl: '../assets/logo.png',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(197,185,185,0.8)',
  pbColor: '#6600ff',
  pbDirection: 'ltr',
  pbThickness: 10,
  hasProgressBar: true,
  text: 'Loading ....',
  textColor: '#6600ff',
  textPosition: 'center-center',
  maxTime: -1,
  minTime: 300
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
