import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Use a private signal to hold the count
  private cartCountSignal = signal<number>(0);

  // Expose it as a read-only signal
  cartCount = this.cartCountSignal.asReadonly();

  addToCart() {
    this.cartCountSignal.update(count => count + 1);
  }

  removeFromCart() {
    this.cartCountSignal.update(count => Math.max(0, count - 1));
  }

  clearCart() {
    this.cartCountSignal.set(0);
  }

}
