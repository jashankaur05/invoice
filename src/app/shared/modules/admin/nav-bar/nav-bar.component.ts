// Angular import
import { AfterViewInit, Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { AppConfig } from 'src/app/app-config';
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import { NavLeftComponent } from './nav-left/nav-left.component';
import { NavRightComponent } from './nav-right/nav-right.component';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NavLogoComponent, NavLeftComponent, NavRightComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements AfterViewInit {
  // public props
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();
  navCollapsed;
  windowWidth: number;
  navCollapsedMob;
  isLoading = false;
  companies: any[] = [];

  // Constructor
  constructor(private navigationService: NavigationService) {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? AppConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 1025) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }

  @HostListener('window:resize', ['$event'])
  // eslint disable-next-line
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    this.navCollapseMob();
  }

  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  ngAfterViewInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    this.navigationService.getCompanies().subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if(resp?.length > 0) {
          this.companies = resp;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log('error', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
