import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() title = '';
  @Input() limitDate!: null | string;
  @Input() description!: null | string;
  @Output() taskClick = new EventEmitter<void>();
}
