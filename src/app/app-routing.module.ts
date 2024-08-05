import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SudokuComponent } from './components/sudoku/sudoku.component';
import { StartComponent } from './components/start/start.component';
import { DifficulytSelectorComponent } from './components/difficulyt-selector/difficulyt-selector.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'select-difficulty', component: DifficulytSelectorComponent },
  { path: 'sudoku', component: SudokuComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
