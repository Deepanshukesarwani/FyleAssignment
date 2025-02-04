import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from './user-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AddWorkoutComponent } from './components/add-workout/add-workout.component';
import { ChartsComponent } from './components/charts/charts.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userService: UserServiceService;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, CommonModule],
      providers: [
        UserServiceService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserServiceService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users from the service on init', () => {
    userService.users = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    component.ngOnInit();
    expect(component.users().length).toBe(1);
  });

  it('should filter users correctly based on search and workout type', () => {
    userService.users = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Swimming', minutes: 45 }] }
    ];
    component.users.set(userService.users);

    component.UserSearch = 'John';
    expect(component.filteredUsers.length).toBe(1);

    component.selectedWorkoutType = 'Running';
    expect(component.filteredUsers.length).toBe(1);
  });

  it('should return correct total pages', () => {
    userService.users = new Array(12).fill({ id: 1, name: 'User', workouts: [] });
    component.users.set(userService.users);

    component.itemsPerPage = 5;
    expect(component.totalPages).toBe(3);
  });

  it('should navigate to next and previous page correctly', () => {
    userService.users = new Array(12).fill({ id: 1, name: 'User', workouts: [] });
    component.users.set(userService.users);

    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should delete a user correctly', () => {
    userService.users = [{ id: 1, name: 'User', workouts: [] }];
    component.users.set(userService.users);

    component.deleteItem(1);
    expect(component.users().length).toBe(0);
  });

  it('should open add workout modal', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of(null) } as any);
    component.openAddUserModal();
    expect(mockDialog.open).toHaveBeenCalledWith(AddWorkoutComponent, { width: '500px' });
  });

  it('should open progress modal', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of(null) } as any);
    component.openProgressModal(1);
    expect(mockDialog.open).toHaveBeenCalledWith(ChartsComponent, {
      minWidth: '80vw',
      minHeight: '50vh',
    });
  });
});
