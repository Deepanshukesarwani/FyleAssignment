import { Component, inject, OnInit } from '@angular/core';
import { UserServiceService } from '../../user-service.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';

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
  userName:string | undefined=''  // Use object instead of array

  constructor(private route: ActivatedRoute) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'] ? Number(params['userId']) : null;
      console.log('Selected User ID:', this.userId);

      this.user = this.userService.users.find(user => user.id === this.userId) || null;
      this.userName=this.user?.name
      if (this.user) {
        this.createChart();
      }
    });
  }

  createChart() {
    if (!this.user) return;

    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart to prevent duplication
    }

    const labels = this.user.workouts.map(workout => workout.type);
    const data = this.user.workouts.map(workout => workout.minutes);

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
          },
        },
      },
    });
  }
}
