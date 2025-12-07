import { Component, inject } from '@angular/core';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';
import { GroupedTasks, TaskService } from '../../services/task.service';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [TaskBoardComponent, AddTaskModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly _taskService = inject(TaskService);
  loading = true;
  tasks: GroupedTasks = {} as GroupedTasks;

  isNewTaskModalOpen = false;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this._taskService
      .getTasks()
      .pipe(
        tap(() => {}),
        catchError(() => {
          // TODO: Show toast
          this.loading = false;
          return EMPTY;
        })
      )
      .subscribe((data) => {
        this.tasks = data;
        this.loading = false;
      });
  }

  openModal() {
    this.isNewTaskModalOpen = true;
  }

  closeModal() {
    this.isNewTaskModalOpen = false;
  }
}
