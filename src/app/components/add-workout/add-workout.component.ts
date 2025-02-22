import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../user-service.service';

@Component({
  selector: 'app-add-workout',
  standalone: true, 
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.css'],
})
export class AddWorkoutComponent {
  private fb = inject(FormBuilder); 
  public dialogRef = inject(MatDialogRef<AddWorkoutComponent>);
  private userService = inject(UserServiceService);


  private nextUserId = this.userService.getNextId();

  userForm: FormGroup = this.fb.group({
    id: [this.nextUserId], 
    name: ['', Validators.required],
    workouts: this.fb.array([this.createWorkoutGroup()]), 
  });

  get workouts(): FormArray {
    return this.userForm.get('workouts') as FormArray;
  }

  createWorkoutGroup(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addWorkout(): void {
    this.workouts.push(this.createWorkoutGroup());
  }

  removeWorkout(index: number): void {
    if (this.workouts.length > 1) {
      this.workouts.removeAt(index);
    }
  }

  submitForm(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      this.userService.addUser(newUser); 
      this.dialogRef.close(newUser); 
    }

    console.log("updated Service",this.userService);
  }
}
