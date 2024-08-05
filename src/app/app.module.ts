import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SudokuComponent } from './components/sudoku/sudoku.component';
import { StartComponent } from './components/start/start.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FailPopupComponent } from './components/fail-popup/fail-popup.component';
import { WinPopupComponent } from './components/win-popup/win-popup.component';
import { DifficulytSelectorComponent } from './components/difficulyt-selector/difficulyt-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    StartComponent,
    FailPopupComponent,
    WinPopupComponent,
    DifficulytSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
