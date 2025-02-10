import { Component, inject, OnInit } from '@angular/core';
import { UserServiceService } from '../../user-service.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

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
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent implements OnInit {
  private userService = inject(UserServiceService);
  userId: number | null = null;
  chart: Chart | null = null;
  user: UserWorkout | null = null;
  userName:string | undefined='' 
  private queryParamsSubscription!: Subscription;

  constructor(private route: ActivatedRoute) {
    Chart.register(...registerables);
  }

  // ngOnInit() {
  //   this.route.queryParams.subscribe((params) => {
  //     this.userId = params['userId'] ? Number(params['userId']) : null;
  //     console.log('Selected User ID:', this.userId);

  //     this.user = this.userService.users.find(user => user.id === this.userId) || null;
  //     this.userName=this.user?.name
  //     if (this.user) {
  //       this.createChart();
  //     }
  //   });
  // }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'] ? Number(params['userId']) : null;
      console.log('Selected User ID:', this.userId);

      this.user = this.userService.users.find(user => user.id === this.userId) || null;
      this.userName = this.user?.name;
      if (this.user) {
        this.createChart();
      }
    });
  }

  createChart() {
    if (!this.user) return;

    if (this.chart) {
      this.chart.destroy(); 
    }
    

    const labels = this.user.workouts.map(workout => workout.type);
    const data = this.user.workouts.map(workout => workout.minutes);


    console.log("data in the charts: ",data);
    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

  

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Minutes',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              offset: true,
            },
          },
          
        },
      },
    });
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  ngOnDestroy() {
    this.destroyChart(); 
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
