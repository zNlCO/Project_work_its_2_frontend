import { Component, HostListener, Input, Output } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    @Input()
    user: User | null = null;

    isScrolled = false;
    isDropdownOpen = false;

    constructor(private authSrv: AuthService) { }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.pageYOffset > 0;
    }

    logout() {
        this.authSrv.logout();
    }

}
