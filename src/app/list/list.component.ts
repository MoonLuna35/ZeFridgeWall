import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-art',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListFristComponent implements OnInit {
  next = 'suivant';
  is_first_list = true; 
  constructor() { }

  ngOnInit(): void {
  }

}


