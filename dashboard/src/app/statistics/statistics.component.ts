import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProcessService } from '../services/process.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  imports: [NgxChartsModule, RouterModule],
  selector: 'app-dashboard',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  totalUsers: number = 0;
  totalCatgories: number = 0;
  totalProducts: number = 0;
  totaldeals: number = 0;
  FinishedProcess: any[] = [];
  PendingProcess: any[] = [];
  totalFinishedProcess: number = 0;
  totalPendingProcess: number = 0;
  totalDailyCosts: any[] = [];
  lastFourProcesses: any[] = [];
  users: any[] = [];
  ComputerCatgory: number = 0;
  CamerasCatgory: number = 0;
  HeadphonesCatgory: number = 0;
  clothes: number = 0;
  furniture: number = 0;
  gem: number = 0;
  kitchen: number = 0;
  tools: number = 0;
  gaming: number = 0;

  processPieChartData: any[] = [];
  advancedPieChartData: any[] = [];

  today: Date = new Date();

  // All statics chart data
  chartData: any[] = [
    { name: 'Users', value: 800 },
    { name: 'Processes', value: 150 },
    { name: 'Products', value: 500 },
    { name: 'Categories', value: 100 },
    { name: 'Costs', value: 600 },
  ];

  view: [number, number] = [1500, 600]; // width, height
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFADED', '#562DDD', '#7045FF', '#C768FF', '#B72A67'],
  };

  updateChartData(): void {
    // Ensure all values are numbers and not NaN
    this.chartData = [
      { name: 'Users', value: isNaN(this.totalUsers) ? 0 : this.totalUsers },
      {
        name: 'Processes',
        value: isNaN(this.totalFinishedProcess) ? 0 : this.totalFinishedProcess,
      },
      {
        name: 'Products',
        value: isNaN(this.totalProducts) ? 0 : this.totalProducts,
      },
      {
        name: 'Categories',
        value: isNaN(this.totalCatgories) ? 0 : this.totalCatgories,
      },
    ];
  }

  lineView: [number, number] = [400, 200];

  updateAdvancedPieChartData(): void {
    this.advancedPieChartData = []; // clear existing data first
    // Ensure all category values are numbers and not NaN
    this.advancedPieChartData = [
      { name: 'Computers', value: this.ComputerCatgory },
      { name: 'Cameras', value: this.CamerasCatgory },
      { name: 'Headphones', value: this.HeadphonesCatgory },
      { name: 'clothes', value: this.clothes },
      { name: 'gaming', value: this.gaming },
      { name: 'furniture', value: this.furniture },
      { name: 'gem', value: this.gem },
      { name: 'tools', value: this.tools },
    ];
  }


  pipeScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFADED', '#562DDD', '#7045FF', '#C768FF', '#B72A67'],
  };

  updateProcessPieChartData(): void {
    // Ensure that values are numbers
    this.processPieChartData = [
      {
        name: 'Pending',
        value: isNaN(this.totalPendingProcess) ? 0 : this.totalPendingProcess,
      },
      {
        name: 'Finished',
        value: isNaN(this.totalFinishedProcess) ? 0 : this.totalFinishedProcess,
      },
    ];
  }

  constructor(
    private userService: UserService,
    private processService: ProcessService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchTotalUsers();
    this.fetchTotalProcess();
    this.fetchTotalCategories();
    this.fetchTotalProducts();
  }

  fetchTotalUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.totalUsers = res.users.length;
        this.updateChartData();
      },
      error: (err) => console.error(err),
    });
  }

  fetchTotalProcess(): void {
    this.processService.getAllProcesses().subscribe({
      next: (res) => {
        this.FinishedProcess = res.filter((item) => item.status == 'finished');
        this.PendingProcess = res.filter((item) => item.status == 'pending');

        // Ensure we are calculating the costs and process numbers correctly
        this.totalDailyCosts = res.filter(
          (item) => item.status == 'in progress' || item.status == 'finished'
        );
        this.totalDailyCosts = this.totalDailyCosts.reduce(
          (total, item) => total + item.price,
          0
        );

        this.lastFourProcesses = res.slice(-4).reverse();

        this.totalFinishedProcess = this.FinishedProcess.length;
        this.totalPendingProcess = this.PendingProcess.length;

        this.updateChartData();
        this.updateProcessPieChartData();
      },
      error: (err) => console.error(err),
    });
  }

  fetchTotalCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        // Ensure the categories data is valid
        if (Array.isArray(res) && res.length > 0) {
          this.totalCatgories = res.length;
          this.updateChartData();
        } else {
          console.error('Categories data is invalid or empty.');
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  fetchTotalProducts(): void {
    this.productService.getallProducts().subscribe({
      next: (res) => {
        if (res.data && Array.isArray(res.data)) {
          this.totalProducts = res.data.length;

          // Debugging logs to ensure correct filtering

          this.ComputerCatgory = res.data.filter(
            (item: any) => item.category?.name === 'computers'
          ).length;
          this.CamerasCatgory = res.data.filter(
            (item: any) => item.category?.name === 'cameras'
          ).length;
          this.HeadphonesCatgory = res.data.filter(
            (item: any) => item.category?.name === 'headphones'
          ).length;

          this.clothes = res.data.filter(
            (item: any) => item.category?.name === 'clothes'
          ).length;
          this.furniture = res.data.filter(
            (item: any) => item.category?.name === 'furniture'
          ).length;
          this.gaming = res.data.filter(
            (item: any) => item.category?.name === 'gaming'
          ).length;
          this.gem = res.data.filter(
            (item: any) => item.category?.name === 'gem'
          ).length;
          this.tools = res.data.filter(
            (item: any) => item.category?.name === 'tools'
          ).length;

          this.updateAdvancedPieChartData();
          console.log(this.advancedPieChartData)

          this.updateChartData();
        } else {
          console.error('Products data is invalid:', res);
        }
      },
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  generateMessage(proc: any): string {
    switch (proc.status) {
      case 'finished':
        return `Process for "${proc.productId?.name}" has completed under ${
          proc.renterId?.userName || 'Uncategorized'
        }`;
      case 'canceled':
        return `Process "${proc.productId?.name}" was canceled from ${
          proc.renterId?.userName || 'Uncategorized'
        }`;
      case 'pending':
        return `New process "${proc.productId?.name}" was pending from ${
          proc.renterId?.userName || 'Uncategorized'
        }`;
      case 'in progress':
        return `New process "${proc.productId?.name}" was in progress from ${
          proc.renterId?.userName || 'Uncategorized'
        }`;
      default:
        return `Process "${proc.productId?.name}" status is unknown.`;
    }
  }
}
