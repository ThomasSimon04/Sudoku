import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private solution!: number[][];

  constructor() {}

  private shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private isValid(board: number[][], row: number, col: number, num: number): boolean {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num ||
          board[boxRow + Math.floor(i / 3)][boxCol + i % 3] === num) {
        return false;
      }
    }
    return true;
  }

  private fillBoard(board: number[][]): boolean {
    const emptyCell = this.findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (this.isValid(board, row, col, num)) {
        board[row][col] = num;
        if (this.fillBoard(board)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  private findEmptyCell(board: number[][]): [number, number] | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  private removeNumbers(board: number[][], numberOfHoles: number): void {
    let count = numberOfHoles;
    while (count > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        count--;
      }
    }
  }

  private getNumberOfHoles(difficulty: string): number {
    switch (difficulty) {
      case 'easy':
        return 30;
      case 'medium':
        return 40;
      case 'hard':
        return 50;
      default:
        return 40;
    }
  }

  generateSudoku(difficulty: string): number[][] {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillBoard(board);
    this.solution = JSON.parse(JSON.stringify(board));
    const numberOfHoles = this.getNumberOfHoles(difficulty);
    this.removeNumbers(board, numberOfHoles);
    return board;
  }

  getSolution(): number[][] {
    return this.solution;
  }
}
