import { TestBed } from '@angular/core/testing';
import { UserServiceService } from './user-service.service';

describe('UserServiceService', () => {
  let service: UserServiceService;

  beforeEach(() => {
    
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'users') {
        return JSON.stringify([
          { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
          { id: 2, name: 'Jane Doe', workouts: [{ type: 'Cycling', minutes: 45 }] }
        ]);
      }
      return null;
    });

    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users from localStorage on initialization', () => {
    expect(service.users.length).toBe(2);
    expect(service.users[0].name).toBe('John Doe');
    expect(service.users[1].name).toBe('Jane Doe');
  });

  it('should save users to localStorage when saveUsersToStorage is called', () => {
    service.saveUsersToStorage();
    expect(localStorage.setItem).toHaveBeenCalledWith('users', JSON.stringify(service.users));
  });

  it('should add a user and save it to localStorage', () => {
    const newUser = { id: 3, name: 'Alice', workouts: [{ type: 'Swimming', minutes: 20 }] };
    service.addUser(newUser);

    expect(service.users.length).toBe(3);
    expect(service.users[2].name).toBe('Alice');
    expect(localStorage.setItem).toHaveBeenCalledWith('users', JSON.stringify(service.users));
  });

  it('should return the next available ID', () => {
    expect(service.getNextId()).toBe(3); 

    service.addUser({ id: 3, name: 'Bob', workouts: [] });
    expect(service.getNextId()).toBe(4); 
  });
});

