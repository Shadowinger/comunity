import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RequestCardComponent } from './components/request-card/request-card.component';

import { HomeComponent } from './pages/home/home.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { RequestDetailComponent } from './pages/request-detail/request-detail.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CreateRequestComponent } from './pages/create-request/create-request.component';

import { AuthInterceptor } from './core/http-interceptors/auth.interceptor';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		PaginationComponent,
		RequestCardComponent,
		HomeComponent,
		RequestsComponent,
		RequestDetailComponent,
		MessagesComponent,
		LoginComponent,
		RegisterComponent,
		ProfileComponent,
		AdminComponent,
		CreateRequestComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}

