import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fail-popup',
  templateUrl: './fail-popup.component.html',
  styleUrls: ['./fail-popup.component.css']
})
export class FailPopupComponent {
  @Input() isVisible: boolean = false;
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
}
