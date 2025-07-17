import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http
      .get<{ success: boolean; data: any[]; message: string }>(this.apiUrl)
      .pipe(map((response) => response.data || []));
  }

  addCategory(category: { name: string; icon: string }): Observable<any> {
    return this.http.post(this.apiUrl, category, this.getAuthHeader());
  }

  updateCategory(
    id: string,
    category: { name: string; icon: string }
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      category,
      this.getAuthHeader()
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeader());
  }

  private getAuthHeader() {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }
}
