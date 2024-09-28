import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private screenSize$: BehaviorSubject<string> = new BehaviorSubject<string>(this.getScreenSize());

  //TODO: USE ANGULAR CDK BreakpointObserver
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Listen for window resize events
    // Check if we are in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Only attach window resize event and perform window-specific logic in the browser
      this.updateScreenSize(); // Set the initial screen size
      window.addEventListener('resize', () => {
        this.updateScreenSize();
      });
    };
  }

  // Get the screen size based on width
  private getScreenSize(): string {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      if (width < 600) {
        return 'mobile';
      } else if (width >= 600 && width < 960) {
        return 'tablet';
      } else {
        return 'desktop';
      }
    }
    return 'desktop'; // Default if not in browser
  }

  // Update the screen size observable
  private updateScreenSize() {
    const size = this.getScreenSize();
    this.screenSize$.next(size);
  }

  // Public method to get the current screen size
  getScreenSizeObservable() {
    return this.screenSize$.asObservable().pipe(debounceTime(200)); // Debouncing to avoid rapid emissions
  }

  // Helper methods to check specific screen types
  isMobile(): boolean {
    return this.getScreenSize() === 'mobile';
  }

  isTablet(): boolean {
    return this.getScreenSize() === 'tablet';
  }

  isDesktop(): boolean {
    return this.getScreenSize() === 'desktop';
  }
}
