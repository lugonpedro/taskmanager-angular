import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CreateTaskDto } from '../../services/task.interfaces';

@Component({
  selector: 'app-add-task-modal',
  imports: [FormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.css',
})
export class AddTaskModalComponent {
  readonly _taskService = inject(TaskService);
  loading = false;

  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateTaskDto>();

  newTask = {
    title: '',
    date: '',
    description: '',
  };

  onOverlayClick() {
    this.resetForm();
    this.close.emit();
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onCloseClick() {
    this.resetForm();
    this.close.emit();
  }

  resetForm() {
    this.newTask = {
      title: '',
      date: '',
      description: '',
    };
  }

  addTask() {
    const dto: CreateTaskDto = {
      title: this.newTask.title,
      description: this.newTask.description,
      limitDate: this.newTask.date,
    };

    this.create.emit(dto);

    this.resetForm();
  }
}
