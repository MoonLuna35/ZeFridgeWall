import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-message',
  templateUrl: './event-message.component.html',
  styleUrls: ['../../../new-evt/new-event/new-event.component.scss', './event-message.component.scss']
})
export class EventMessageComponent implements OnInit {
  @Input() message_event: FormGroup;  
  constructor() { }

  ngOnInit(): void {
  }

}
