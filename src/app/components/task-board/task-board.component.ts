import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskColumnComponent } from '../task-column/task-column.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { GroupedTasks, Task, TaskStatus } from '../../services/task.interfaces';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent, TaskCardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
})
export class TaskBoardComponent {
  @Input() tasks!: GroupedTasks;

  columns: TaskStatus[] = ['TODO', 'DOING', 'DONE'];

  @Output() taskClick = new EventEmitter<Task>();
}
