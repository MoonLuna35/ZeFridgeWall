import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-fridge-door',
  templateUrl: './fridge-door.component.html',
  styleUrls: ['./fridge-door.component.css']
})
export class FridgeDoorComponent implements OnInit {

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  

  colorCtr: FormControl = new FormControl(null);

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public codeColorPicker = `
  <mat-form-field>
    <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr">
    <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
    <ngx-mat-color-picker #picker></ngx-mat-color-picker>
  </mat-form-field>`;

  constructor(private dialogRef: MatDialog) {
    this.dialogRef.closeAll();
   }

  ngOnInit() {
  }

}
