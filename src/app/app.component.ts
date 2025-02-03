import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddWorkoutComponent } from './components/add-workout/add-workout.component';
import { UserServiceService } from './user-service.service';
import { ChartsComponent } from './components/charts/charts.component';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
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
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private dialog: MatDialog,
    private userService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  title = 'my-project';
  users = signal<UserWorkout[]>([]);
  UserSearch = '';
  selectedWorkoutType: string = 'All';
  currentPage = 1;
  itemsPerPage = 5;
  selectedUserId: number | null = null;

  usersEffect = effect(() => {
    console.log('Users updated:', this.users());
    this.currentPage = 1;
  });

  ngOnInit() {
    this.users.set(this.userService.users);
  }

  get filteredUsers() {
    return this.users().filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(this.UserSearch.toLowerCase());
      const matchesWorkout =
        this.selectedWorkoutType === 'All' ||
        this.selectedWorkoutType === '' ||
        user.workouts.some(
          (workout) => workout.type === this.selectedWorkoutType
        );

      return matchesSearch && matchesWorkout;
    });
  }

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
    this.userService.users = this.userService.users.filter(
      (todo) => todo.id !== id
    );
    this.users.set(this.userService.users);
    this.userService.saveUsersToStorage();
  }

  getTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((acc, w) => acc + w.minutes, 0);
  }

  getWorkoutTypes(workouts: Workout[]): string {
    return workouts.map((w) => w.type).join(', ');
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddWorkoutComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New User Data:', result);
      }
    });
  }

  openProgressModal(id: number): void {
    console.log(`Open modal clicked with id: ${id} `);
    this.router.navigate([],{
      queryParams:{userId:id},
      queryParamsHandling:'merge'
    })
    const dialogRef = this.dialog.open(ChartsComponent, {
      minWidth: '80vw',
      minHeight: '50vh',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Modal closed. Destroying chart...');
      const chartComponent = dialogRef.componentInstance as ChartsComponent;
      if (chartComponent && chartComponent.destroyChart) {
        chartComponent.destroyChart();
      }
    });
  }
}

// import { Component, effect, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { AddWorkoutComponent } from './components/add-workout/add-workout.component';
// import { UserServiceService } from './user-service.service';
// import { ChartsComponent } from './components/charts/charts.component';
// import { ActivatedRoute, Router } from '@angular/router';  // Import for routing

// interface Workout {
//   type: string;
//   minutes: number;
// }

// interface UserWorkout {
//   id: number;
//   name: string;
//   workouts: Workout[];
// }

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css',
// })
// export class AppComponent {
//   constructor(
//     private dialog: MatDialog,
//     private userService: UserServiceService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   title = 'my-project';
//   users = signal<UserWorkout[]>([]);
//   UserSearch = '';
//   selectedWorkoutType: string = 'All';
//   currentPage = 1;
//   itemsPerPage = 5;
//   selectedUserId: number | null = null;  // Store selected user ID

//   usersEffect = effect(() => {
//     console.log('Users updated:', this.users());
//     this.currentPage = 1;
//   });

//   ngOnInit() {
//     this.users.set(this.userService.users);

//     // Listen for URL changes to get userId
//     this.route.queryParams.subscribe(params => {
//       this.selectedUserId = params['userId'] ? Number(params['userId']) : null;
//     });
//   }

//   openProgressModal(id: number): void {
//     console.log(`Open modal clicked with id: ${id}`);

//     // Update URL with userId
//     this.router.navigate([], {
//       queryParams: { userId: id },
//       queryParamsHandling: 'merge',  // Merge with existing query params
//     });

//     const dialogRef = this.dialog.open(ChartsComponent, {
//       minWidth: '80vw',
//       minHeight: '50vh',
//     });

//     // When the modal closes, remove userId from URL
//     dialogRef.afterClosed().subscribe(() => {
//       this.router.navigate([], {
//         queryParams: { userId: null },  // Reset URL
//         queryParamsHandling: 'merge',
//       });
//     });
//   }
// }
