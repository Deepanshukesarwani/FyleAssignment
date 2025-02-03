// import { Injectable } from '@angular/core';

// interface Workout {
//   type: string;
//   minutes: number;
// }
// interface User {
//   id: number;
//   name: string;
//   workouts: Workout[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UserServiceService {
//   constructor() {}

//   users: User[] = [
//     { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
//     { id: 2, name: 'Deepak', workouts: [{ type: 'Swimming', minutes: 20 }, { type: 'Gym', minutes: 10 }] },
//     { id: 3, name: 'Deepali', workouts: [{ type: 'Swimming', minutes: 20 }] },
//     { id: 4, name: 'Deepak', workouts: [{ type: 'Study', minutes: 100 }] },
//     { id: 5, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
//     { id: 6, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
//   ];

//   /** 🔹 Add new user to the list */
//   addUser(user: User): void {
//     this.users.push(user);
//   }

//   /** 🔹 Get the next user ID */
//   getNextId(): number {
//     return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
//   }
// }

import { Injectable } from '@angular/core';

interface Workout {
  type: string;
  minutes: number;
}
interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private STORAGE_KEY = 'users'; // 🔹 LocalStorage key for users data

  users: User[] = [];

  constructor() {
    this.loadUsersFromStorage(); // ✅ Load data from LocalStorage on service initialization
  }

  /** ✅ Load users from LocalStorage */
  private loadUsersFromStorage(): void {
    const storedUsers = localStorage.getItem(this.STORAGE_KEY);
    this.users = storedUsers ? JSON.parse(storedUsers) : [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
      { id: 2, name: 'Deepak', workouts: [{ type: 'Swimming', minutes: 20 }, { type: 'Gym', minutes: 10 }] },
      { id: 3, name: 'Deepali', workouts: [{ type: 'Swimming', minutes: 20 }] },
      { id: 4, name: 'Deepak', workouts: [{ type: 'Study', minutes: 100 }] },
      { id: 5, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
      { id: 6, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
    ];
    this.saveUsersToStorage(); // Ensure data is saved if LocalStorage was empty
  }

  /** ✅ Save users to LocalStorage */
  public saveUsersToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
  }

  /** ✅ Add new user and update LocalStorage */
  addUser(user: User): void {
    this.users.push(user);
    this.saveUsersToStorage(); // 🔹 Save updated list to LocalStorage
  }

  /** ✅ Get the next available user ID */
  getNextId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
  }
}

