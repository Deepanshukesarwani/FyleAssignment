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
  private STORAGE_KEY = 'users'; 

  users: User[] = [];

  constructor() {
    this.loadUsersFromStorage(); 
  }

  private loadUsersFromStorage(): void {
    const storedUsers = localStorage.getItem(this.STORAGE_KEY);
    this.users = storedUsers ? JSON.parse(storedUsers) : [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
      { id: 2, name: 'Deepak', workouts: [{ type: 'Swimming', minutes: 20 }, { type: 'Gym', minutes: 10 }] },
      { id: 3, name: 'Deepali', workouts: [{ type: 'Swimming', minutes: 20 }] },
      { id: 4, name: 'Deepak', workouts: [{ type: 'Cycling', minutes: 100 }] },
      { id: 5, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
      { id: 6, name: 'Mike Johnson', workouts: [{ type: 'Gym', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
    ];
    this.saveUsersToStorage(); 
  }


  public saveUsersToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
  }

  addUser(user: User): void {
    this.users.push(user);
    this.saveUsersToStorage(); 
  }

  getNextId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
  }
}

