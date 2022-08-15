import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    desc: [""]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>
  ) { }

  ngOnInit(): void {
    if(this.data.name !== undefined && this.data.desc !== undefined) {
      this.taskForm.patchValue({name: this.data.name});
      this.taskForm.patchValue({desc: this.data.desc});
    }
    
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.dialogRef.close(this.taskForm);
  }

}
