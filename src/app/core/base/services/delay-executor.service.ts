import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DelayExecutorService {
  private timer: any | undefined;
  
  constructor() { }

  executeWithDelay(callback: () => void, delay: number): void {

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      callback();
      this.timer = undefined;
    }, delay);
  }
}
