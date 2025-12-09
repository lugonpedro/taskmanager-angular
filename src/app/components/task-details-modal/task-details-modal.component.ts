import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Task, UpdateTaskDto } from '../../services/task.interfaces';

@Component({
  selector: 'app-task-details-modal',
  imports: [FormsModule, DatePipe],
  templateUrl: './task-details-modal.component.html',
  styleUrl: './task-details-modal.component.css',
})
export class TaskDetailsModalComponent {
  isEditing = false;

  form = {
    title: '',
    description: '',
    limitDate: ''
  };

  @Input() visible = false;
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<{ id: number; dto: UpdateTaskDto }>();
  @Output() delete = new EventEmitter<{ id: number }>();

  ngOnChanges() {
    if (this.task) {
      this.form = {
        title: this.task.title,
        description: this.task.description ?? '',
        limitDate: this.task.limitDate ?? '',
      };
    }
  }

  onOverlayClick() {
    this.close.emit();
    this.isEditing = false;
  }

  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }

  startEdit() {
    if (!this.task) return;
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;

    if (this.task) {
      this.form = {
        title: this.task.title,
        description: this.task.description ?? '',
        limitDate: this.task.limitDate ?? ''
      };
    }
  }

  save() {
    if (!this.task) return;

    const dto: UpdateTaskDto = {
      title: this.form.title,
      description: this.form.description || null,
      limitDate: this.form.limitDate || null
    };

    this.update.emit({ id: this.task.id, dto });
    this.isEditing = false;
  }

  deleteTask() {
    if (!this.task) return;

    this.delete.emit({ id: this.task.id });
    this.isEditing = false;
  }
}
