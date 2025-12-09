import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-column',
  imports: [FormsModule],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.css',
})
export class TaskColumnComponent {
  @Input() title = '';
  @Output() addCard = new EventEmitter<string>();

  isAdding = false;
  newTitle = '';

  startAdding() {
    this.isAdding = true;
    this.newTitle = '';
  }

  cancelAdding() {
    this.isAdding = false;
    this.newTitle = '';
  }

  confirmAdd() {
    const title = this.newTitle.trim();
    if (!title) {
      return;
    }

    this.addCard.emit(title);
    this.isAdding = false;
    this.newTitle = '';
  }
}
