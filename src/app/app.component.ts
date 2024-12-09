import { Component, HostListener } from '@angular/core';
import { AdminComponent } from './shared/modules/admin/admin.component';
import { ConfigurationComponent } from './shared/modules/admin/configuration/configuration.component';
import { NavBarComponent } from './shared/modules/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './shared/modules/admin/nav-bar/nav-left/nav-left.component';
import { NavLogoComponent } from './shared/modules/admin/nav-bar/nav-logo/nav-logo.component';
import { NavRightComponent } from './shared/modules/admin/nav-bar/nav-right/nav-right.component';
import { NavCollapseComponent } from './shared/modules/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavContentComponent } from './shared/modules/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './shared/modules/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './shared/modules/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavigationComponent } from './shared/modules/admin/navigation/navigation.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { NavigationItem } from './shared/modules/admin/navigation/navigation';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './shared/modules/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AdminComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent,
    ConfigurationComponent,
    GuestComponent,
    SpinnerComponent,
    // BrowserModule, 
    // BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NavigationItem],
})
export class AppComponent {
  title = 'Berry Angular Free Version';
  constructor(){
    console.log('first call app compponent')
  }
  // @HostListener("window:beforeunload", ["$event"])
  // clearLocalStorage(event: BeforeUnloadEvent) {
  //   localStorage.removeItem('companyData');
  // }
}
