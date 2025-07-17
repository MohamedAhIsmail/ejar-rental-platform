import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/product/';

  constructor(private http: HttpClient) {}

  getallProducts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  removeProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}`, this.getAuthHeader());
  }

  updateProduct(updatedData: any): Observable<any> {
    const url = `${this.baseUrl}${updatedData._id}`;
    return this.http.post(url, updatedData, this.getAuthHeader());
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
