import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { ControllerComponent } from './controller/controller.component'
import { ScreenComponent } from './screen/screen.component'

const routes: Routes = [
  { path: '', redirectTo: '/screen', pathMatch: 'full' },
  { path: 'screen', component: ScreenComponent },
  { path: 'controller', component: ControllerComponent }
]

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }

export const routingComponents = [ScreenComponent, ControllerComponent];
