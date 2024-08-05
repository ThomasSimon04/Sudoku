import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-difficulyt-selector',
  templateUrl: './difficulyt-selector.component.html',
  styleUrls: ['./difficulyt-selector.component.css']
})
export class DifficulytSelectorComponent {
  faArrowLeft = faArrowLeft;

  constructor(private router: Router) { }

  selectDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    localStorage.setItem('selectedDifficulty', difficulty);
    this.router.navigate(['/sudoku']);
  }

  navigateBackToStart() {
    this.router.navigate(['/start']);
  }
}
