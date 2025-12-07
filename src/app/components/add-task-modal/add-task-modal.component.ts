import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-modal',
  imports: [FormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.css'
})
export class AddTaskModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  newTask = {
    title: '',
    date: '',
    description: '',
  };

  onOverlayClick() {
    this.close.emit();
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onCloseClick() {
    this.close.emit();
  }

  addTask() {
    // console.log('Nova task:', this.newTask);
    // this.closeModal();
  }
}
