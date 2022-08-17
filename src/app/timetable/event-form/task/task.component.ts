
import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { TaskFormComponent } from './task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DateService } from '../../time-table/time-table.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() event: FormGroup;
  @Input() childIndex: number;
  @Input() taskTree: FormGroup;
  @Input() h: number;
  @Output() taskToDeleteEvent = new EventEmitter<number>(); 

  is_editable = true;
  children_are_deployed = true;

  taskTreeH0 = this.fb.group({
    name: ["", Validators.required],
    desc: [""],
    children : this.fb.array([])
  }) 

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dateService: DateService,
    private datePipe: DatePipe
    ) {
    
  }

  get task(): FormArray {
    return this.taskTree.get("children") as FormArray;

  }

  OnAddClicked() :void {
    this.addTask();
  }

  onNameFocus(event: Event): void {
    (event.target as HTMLElement).blur();
    const dialogRef = this.dialog.open(TaskFormComponent, 
      {
        width: '300px',
        height: "400px",
        maxHeight: '350px',
        panelClass: 'eventDialog',
        data: {
          name: this.taskTree.get('name')?.value,
          desc: this.taskTree.get('desc')?.value
        }
    });
    
    dialogRef.afterClosed().subscribe(result => { 
      if(result !== undefined) {
        this.taskTree.patchValue({name: result.get("name")?.value});
        this.taskTree.patchValue({desc: result.get("desc")?.value});
      }
      
    });
     
  }

  OnRemoveClicked(): void {
    this.taskToDeleteEvent.emit(this.childIndex);

  }


  OnTaskToDeletEventRecieve(event: number) {
    console.log(event);

    this.task.removeAt(event);
  }

  addTask() {
    const taskForm = this.fb.group({
      name: ["", Validators.required],
      desc: [""],
      children: this.fb.array([])
    })
    this.task.push(taskForm);
  }

  hasChildren(): boolean {
    return (this.taskTree.get('children') as FormArray).length !== 0
  }

  ngOnInit(): void {
    
    if(this.h === undefined) {
      this.taskTree = this.taskTreeH0;
      this.event.setControl("event", this.taskTree);
      let foo = this.datePipe.transform(this.dateService.coordinate_date, 'yyy-MM-dd');
      if(foo !== null) {
        this.taskTree.addControl("date_begin", new FormControl(this.datePipe.transform(this.dateService.coordinate_date, 'yyy-MM-dd'))); 
      this.taskTree.addControl("time_begin", new FormControl(this.datePipe.transform(this.dateService.coordinate_date, 'HH:mm')));
      }
      
    }
    if(this.h === undefined) {
      
      this.h = 0;
    }
  }
}
