
import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';


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
    name: [""],
    children : this.fb.array([])
  }) 

  hasChildren = false;
  constructor(private fb: FormBuilder) {
    
  }

  get task(): FormArray {
    return this.taskTree.get("children") as FormArray;

  }

  OnAddClicked() :void {
    this.addTask();
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
      name: [""],
      children: this.fb.array([])
    })
    this.task.push(taskForm);
  }

  ngOnInit(): void {
    
    if(this.h === undefined) {
      this.taskTree = this.taskTreeH0;
      this.event.setControl("event", this.taskTree); 
    }
    if(this.h === undefined) {
      this.h = 0;
    }
  }
}
