import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { RequestDetailComponent } from './pages/request-detail/request-detail.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'home', component: HomeComponent },
	{ path: 'requests', component: RequestsComponent },
	{ path: 'request/:id', component: RequestDetailComponent },
	{ path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'profile/:id', component: ProfileComponent },
	{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
	{ path: 'create-request', component: CreateRequestComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: 'home' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}

