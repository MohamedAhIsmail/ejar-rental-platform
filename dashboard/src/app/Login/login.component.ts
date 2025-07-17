import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
  ],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  apiError: string | null = null;
  isLoading: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private _FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this._FormBuilder.group({
      identifier: ['', [this.identifierValidator]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
  }

  identifierValidator(control: any) {
    const value = control.value;
    if (!value || value.trim() === '') {
      return { required: true };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01[0125][0-9]{8}$/;

    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return null; // Valid
    }

    return {
      invalidIdentifier: true,
    };
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.apiError = null;
    this.isLoading = true;

    const { identifier, password } = this.loginForm.value;

    this.http
      .post<any>('http://localhost:3000/api/auth/login', {
        identifier,
        password,
      })
      .subscribe({
        next: (res) => {
          const decodedToken = jwtDecode<any>(res.token);

          const userRole = decodedToken.role;

          this.isLoading = false;

          if (userRole === 'admin') {
            if (this.rememberMe) {
              localStorage.setItem('authToken', res.token);
              this.router.navigate(['/statistics']);
            } else {
              sessionStorage.setItem('authToken', res.token);
              this.router.navigate(['/statistics']);
            }
          } else {
            this.apiError = 'You do not have permission to access this page';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.apiError = err.error?.message || 'error';
        },
      });
  }
}
