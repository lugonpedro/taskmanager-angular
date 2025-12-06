import { Component } from '@angular/core';
import { TaskColumnComponent } from '../task-column/task-column.component';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent, TaskCardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent {

}
