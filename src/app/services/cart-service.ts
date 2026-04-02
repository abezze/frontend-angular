import { Injectable, signal, computed } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Use a private signal to hold the count
  private cartCountSignal = signal<number>(0);
  private msgCart =   signal('');

  // Expose it as a read-only signal
  cartCount = this.cartCountSignal.asReadonly();
  msgCartRO = this.msgCart.asReadonly();

  addToCart() {
    this.cartCountSignal.update(count => count + 1);
  }

  removeFromCart() {
    this.cartCountSignal.update(count => Math.max(0, count - 1));
  }

  clearCart() {
    this.cartCountSignal.set(0);
  }

  setMsg(par: string){
    this.msgCart.set(par);
  }
  setCartNumber(num: number){
    this.cartCountSignal.set(num);
  }

}
