import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddWorkoutComponent } from './components/add-workout/add-workout.component';
import { UserServiceService } from './user-service.service';

interface Workout {
  type: string;
  minutes: number;
}

interface UserWorkout {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-root',
  imports: [
   
        FormsModule,
        // MatSlideToggleModule,
        CommonModule,
        // MatDialogModule,
        // AddWorkoutComponent
      ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private dialog: MatDialog, private userService: UserServiceService) {}

  title = 'my-project';
  users = signal<UserWorkout[]>([]);
  UserSearch = ''; // Search query
  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit() {
    // Load users from UserService
    this.users.set(this.userService.users);

    // Effect to log changes
    effect(() => {
      console.log('Users updated:', this.users());
      this.currentPage = 1; // Reset pagination when users change
    });
  }

  /** 🔍 Filter users based on search query */
  get filteredUsers() {
    return this.users().filter(user =>
      user.name.toLowerCase().includes(this.UserSearch.toLowerCase())
    );
  }

  /** 📌 Get paginated and filtered users */
  get paginatedTodos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  updateItem(id: number) {
    alert(`Update Item with ID: ${id}`);
  }

  deleteItem(id: number) {
    this.userService.users = this.userService.users.filter(todo => todo.id !== id);
    this.users.set(this.userService.users);
    this.userService.saveUsersToStorage();
  }

  getTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((acc, w) => acc + w.minutes, 0);
  }

  getWorkoutTypes(workouts: Workout[]): string {
    return workouts.map(w => w.type).join(', ');
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddWorkoutComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New User Data:', result);
      }
    });
  }
}
