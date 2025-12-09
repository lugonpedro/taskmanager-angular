import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskColumnComponent } from '../task-column/task-column.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { GroupedTasks, Task, TaskStatus } from '../../services/task.interfaces';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent, TaskCardComponent, CdkDropList, CdkDrag],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
})
export class TaskBoardComponent {
  readonly _taskService = inject(TaskService);
  toast = inject(ToastService);
  @Input() tasks!: GroupedTasks;
  columns: TaskStatus[] = ['TODO', 'DOING', 'DONE'];
  @Output() taskClick = new EventEmitter<Task>();
  connectedTo: Record<TaskStatus, TaskStatus[]> = {} as any;

  ngOnInit() {
    this.connectedTo = this.columns.reduce((acc, col) => {
      acc[col] = this.columns.filter((c) => c !== col);
      return acc;
    }, {} as Record<TaskStatus, TaskStatus[]>);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const { previousContainer, container, previousIndex, currentIndex } =
        event;

      transferArrayItem(
        previousContainer.data,
        container.data,
        previousIndex,
        currentIndex
      );

      const movedTask = container.data[currentIndex];
      if (!movedTask) return;

      const newStatus = container.id as TaskStatus;
      movedTask.status = newStatus;

      this._taskService.updateTaskStatus(movedTask.id, newStatus).subscribe({
        error: () => this.toast.error('Error updating task status'),
      });
    }
  }
}
