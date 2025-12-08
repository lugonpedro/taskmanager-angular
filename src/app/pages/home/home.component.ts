import { Component, inject } from '@angular/core';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';
import { TaskService } from '../../services/task.service';
import { catchError, EMPTY, tap } from 'rxjs';
import {
  GroupedTasks,
  CreateTaskDto,
  Task,
  UpdateTaskDto,
} from '../../services/task.interfaces';
import { TaskDetailsModalComponent } from '../../components/task-details-modal/task-details-modal.component';

@Component({
  selector: 'app-home',
  imports: [
    TaskBoardComponent,
    AddTaskModalComponent,
    TaskDetailsModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly _taskService = inject(TaskService);
  loading = true;
  tasks: GroupedTasks = {} as GroupedTasks;

  isNewTaskModalOpen = false;

  isDetailsModalOpen = false;
  selectedTask: Task | null = null;

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
        // TODO: Show toast
      });
  }

  openNewTaskModal() {
    this.isNewTaskModalOpen = true;
  }

  closeNewTaskModal() {
    this.isNewTaskModalOpen = false;
  }

  onCreateTask(dto: CreateTaskDto) {
    this._taskService.createTask(dto).subscribe({
      next: (task) => {
        this.tasks[task.status].push(task);
        this.isNewTaskModalOpen = false;
        // TODO: Show toast
      },
      error: () => {
        // TODO: Show toast
      },
    });
  }

  openDetails(task: Task) {
    this.selectedTask = task;
    this.isDetailsModalOpen = true;
  }

  closeDetails() {
    this.isDetailsModalOpen = false;
    this.selectedTask = null;
  }

  onUpdateTask(event: { id: number; dto: UpdateTaskDto }) {
    this._taskService.updateTask(event.id, event.dto).subscribe({
      next: (updatedTask) => {
        const oldStatus = this.selectedTask!.status;
        const newStatus = updatedTask.status;

        if (oldStatus) {
          this.tasks[oldStatus] = this.tasks[oldStatus].filter(
            (t) => t.id !== updatedTask.id
          );
        }

        this.tasks[newStatus].push(updatedTask);

        this.selectedTask = updatedTask;
        this.isDetailsModalOpen = false;
        // TODO: Show toast
      },
      error: () => {
        // TODO: Show toast
      },
    });
  }

  onDeleteTask(event: { id: number }) {
    this._taskService.deleteTask(event.id).subscribe({
      next: (deletedTask) => {
        const taskStatus = this.selectedTask!.status;

        this.tasks[taskStatus] = this.tasks[taskStatus].filter(
          (t) => t.id !== event.id
        );
        this.isDetailsModalOpen = false;
        // TODO: Show toast
      },
      error: () => {
        // TODO: Show toast
      },
    });
  }

  onDragAndDropTask() {
    // const oldStatus = this.selectedTask?.status;
    // const newStatus = updatedTask.status;
    // if (oldStatus) {
    //   this.tasks[oldStatus] = this.tasks[oldStatus].filter(
    //     (t) => t.id !== updatedTask.id
    //   );
    // }
    // this.tasks[newStatus].push(updatedTask);
  }
}
