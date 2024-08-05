import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-win-popup',
  templateUrl: './win-popup.component.html',
  styleUrls: ['./win-popup.component.css']
})
export class WinPopupComponent {
  @Input() isVisible: boolean = false;
  @Input() finalTime: number = 0;
  @Input() difficulty: string = 'easy';
  @Input() errorCount: number = 0; 
  @Output() close = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();
  @Output() backToStart = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onRestart(): void {
    this.restart.emit();
  }

  onBackToStart(): void {
    this.backToStart.emit();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  
}
