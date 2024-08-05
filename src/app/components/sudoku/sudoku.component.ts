import { Component, OnDestroy, OnInit } from '@angular/core';
import { SudokuService } from 'src/app/services/sudoku.service';
import { faEraser, faUndo, faPen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit, OnDestroy {
  board!: number[][];
  solution!: number[][];
  userInput: Set<string> = new Set();
  notes: Map<string, Set<number>> = new Map();
  selectedCell: { row: number, col: number } | null = null;
  isNoteMode: boolean = false;
  incorrectCells: Set<string> = new Set();
  errorCount: number = 0;
  maxErrors: number = 3;
  difficulty: string = 'easy';
  history: {
    board: number[][],
    userInput: Set<string>,
    notes: string,
    incorrectCells: Set<string>
  }[] = [];
  highlightedCells: Set<string> = new Set();
  sameValueCells: Set<string> = new Set();

  faEraser = faEraser;
  faUndo = faUndo;
  faPen = faPen;
  faArrowLeft = faArrowLeft;

  timeElapsed: number = 0;
  intervalId: any;
  finalTime: number = 0;
  showErrorPopup: boolean = false;
  showWinPopup: boolean = false;

  constructor(private sudokuService: SudokuService, private router: Router) {}

  ngOnInit(): void {
    const savedGame = localStorage.getItem('sudokuData');
    if (savedGame) {
      this.loadGame(JSON.parse(savedGame));
    } else {
      this.startNewGame();
    }
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.saveGame();
  }

  startNewGame(): void {
    this.difficulty = localStorage.getItem('selectedDifficulty') || 'easy';
    this.board = this.sudokuService.generateSudoku(this.difficulty);
    this.solution = this.sudokuService.getSolution();
    this.userInput.clear();
    this.notes.clear();
    this.selectedCell = null;
    this.incorrectCells.clear();
    this.errorCount = 0;
    this.history = [];
    this.timeElapsed = 0;
    this.saveHistory(); 
  }

  saveGame(): void {
    const gameState = {
      board: this.board,
      userInput: Array.from(this.userInput),
      notes: JSON.stringify(Array.from(this.notes.entries())),
      incorrectCells: Array.from(this.incorrectCells),
      errorCount: this.errorCount,
      timeElapsed: this.timeElapsed,
      solution: this.solution,
      difficulty: this.difficulty,
      history: this.history.map(state => ({
        board: state.board,
        userInput: Array.from(state.userInput),
        notes: state.notes,
        incorrectCells: Array.from(state.incorrectCells),
      }))
    };
    localStorage.setItem('sudokuData', JSON.stringify(gameState));
  }

  loadGame(gameState: any): void {
    this.board = gameState.board;
    this.userInput = new Set(gameState.userInput);
    this.notes = new Map(JSON.parse(gameState.notes));
    this.incorrectCells = new Set(gameState.incorrectCells);
    this.errorCount = gameState.errorCount;
    this.timeElapsed = gameState.timeElapsed;
    this.solution = gameState.solution;
    this.difficulty = gameState.difficulty;
    this.history = gameState.history.map((state: any) => ({
      board: state.board,
      userInput: new Set(state.userInput),
      notes: state.notes,
      incorrectCells: new Set(state.incorrectCells),
      errorCount: state.errorCount
    }));
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.timeElapsed += 0.1;
    }, 100);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  changeDifficulty(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value as 'easy' | 'medium' | 'hard';
    this.board = this.sudokuService.generateSudoku(value);
    this.solution = this.sudokuService.getSolution();
    this.startNewGame();
  }

  selectCell(rowIndex: number, colIndex: number): void {
    this.selectedCell = { row: rowIndex, col: colIndex };
    this.highlightRelatedCells(rowIndex, colIndex);
  }

  startInputNumber(num: number): void {
    if (this.selectedCell) {
      const { row, col } = this.selectedCell;
      const key = `${row}-${col}`;
      if (this.isNoteMode) {
        if (!this.notes.has(key)) {
          this.notes.set(key, new Set());
        }
        const noteSet = this.notes.get(key)!;
        if (noteSet.has(num)) {
          noteSet.delete(num);
        } else {
          noteSet.add(num);
        }
      } else {
        if (this.board[row][col] === 0 || this.isUserInput(row, col)) {
          this.board[row][col] = num;
          this.userInput.add(key);
          this.notes.delete(key);

          if (this.solution[row][col] !== num) {
            this.incorrectCells.add(key);
            this.errorCount++;
            if (this.errorCount >= this.maxErrors) {
              this.showErrorPopup = true;
              this.startNewGame();
              return;
            }
          } else {
            this.incorrectCells.delete(key);
          }
          this.saveHistory();
          this.saveGame();
        }
      }
      this.selectedCell = null;
    }
    if (this.isGameWon()) {
      this.finalTime = this.timeElapsed;
      console.log(this.finalTime);
      
      this.showWinPopup = true;
      this.saveGame();
    }
  }

  isGameWon(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] !== this.solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  onFailPopupClose(): void {
    this.showErrorPopup = false;
  }

  onFailPopupRestart(): void {
    this.showErrorPopup = false;
    this.startNewGame();
    this.saveGame();
  }

  onFailPopupBackToStart(): void {
    this.showErrorPopup = false;
    this.router.navigate(['/start']);
  }

  onWinPopupClose(): void {
    this.showWinPopup = false;
  }

  onWinPopupRestart(): void {
    this.showWinPopup = false;
    this.startNewGame();
    this.saveGame();
  }

  onWinPopupBackToStart(): void {
    this.showWinPopup = false;
    this.router.navigate(['/start']);
  }

  getCurrentDifficulty(): string {
    return this.errorCount >= 30 ? 'hard' : this.errorCount >= 20 ? 'medium' : 'easy';
  }

  startDeleteNumber(): void {
    if (this.selectedCell) {
      const { row, col } = this.selectedCell;
      const key = `${row}-${col}`;
      if (this.isUserInput(row, col)) {
        this.board[row][col] = 0;
        this.userInput.delete(key);
        this.incorrectCells.delete(key);
        this.notes.delete(key);
        this.saveHistory();
        this.saveGame();
      }
      this.selectedCell = null;
    }
  }

  isUserInput(row: number, col: number): boolean {
    return this.userInput.has(`${row}-${col}`);
  }

  toggleNoteMode(): void {
    this.isNoteMode = !this.isNoteMode;
  }

  getNotes(row: number, col: number): Set<number> | null {
    return this.notes.get(`${row}-${col}`) || null;
  }

  isIncorrectCell(row: number, col: number): boolean {
    return this.incorrectCells.has(`${row}-${col}`);
  }

  saveHistory(): void {
    const notes = JSON.stringify(Array.from(this.notes.entries()));
    this.history.push({
      board: this.board.map(row => row.slice()),
      userInput: new Set(this.userInput),
      notes: notes,
      incorrectCells: new Set(this.incorrectCells),
    });
  }

  undo(): void {
    if (this.history.length > 1) {
      this.history.pop();
      const lastState = this.history[this.history.length - 1];
      this.board = lastState.board.map(row => row.slice());
      this.userInput = new Set(lastState.userInput);
      this.notes = new Map(JSON.parse(lastState.notes));
      this.incorrectCells = new Set(lastState.incorrectCells);
      this.saveGame();
    }
  }

  highlightRelatedCells(row: number, col: number): void {
    this.highlightedCells.clear();
    this.sameValueCells.clear();

    const value = this.board[row][col];

    for (let c = 0; c < 9; c++) {
      this.highlightedCells.add(row + '-' + c);
    }

    for (let r = 0; r < 9; r++) {
      this.highlightedCells.add(r + '-' + col);
    }

    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
      for (let c = boxColStart; c < boxColStart + 3; c++) {
        this.highlightedCells.add(r + '-' + c);
      }
    }

    if (value !== 0) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.board[r][c] === value && value !== 0) {
            this.sameValueCells.add(r + '-' + c);
          }
        }
      }
    }
  }

  navigateBackToStart() {
    this.router.navigate(['/start']);
  }
}
