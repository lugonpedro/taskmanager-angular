import { Component, Input } from '@angular/core';
import { TaskColumnComponent } from '../task-column/task-column.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { GroupedTasks } from '../../services/task.service';

type ColumnKey = keyof GroupedTasks;

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent, TaskCardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
})
export class TaskBoardComponent {
  @Input() tasks!: GroupedTasks;

  columns: ColumnKey[] = ['TODO', 'DOING', 'DONE'];
}
