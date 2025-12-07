import { Component } from '@angular/core';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';

@Component({
  selector: 'app-home',
  imports: [TaskBoardComponent, AddTaskModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isNewTaskModalOpen = false;

  openModal() {
    this.isNewTaskModalOpen = true;
  }

  closeModal() {
    this.isNewTaskModalOpen = false;
  }
}
