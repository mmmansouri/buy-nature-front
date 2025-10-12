import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CartNotification {
  itemName: string;
  itemImage: string;
  itemPrice: number;
  quantity: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private cartNotificationSubject = new Subject<CartNotification>();

  // Observable for components to subscribe to
  cartNotification$ = this.cartNotificationSubject.asObservable();

  /**
   * Show a cart notification
   */
  showCartNotification(notification: Omit<CartNotification, 'timestamp'>): void {
    this.cartNotificationSubject.next({
      ...notification,
      timestamp: Date.now()
    });
  }
}
