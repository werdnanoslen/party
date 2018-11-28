import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { ControllerComponent } from './controller/controller.component'
import { ScreenComponent } from './screen/screen.component'

const routes = [
  { path: 'root', component: AppComponent },
  { path: 'screen', component: ScreenComponent },
  { path: 'controller', component: ControllerComponent }
]

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
