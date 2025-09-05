import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  generateCv(data: any) {
    return this.http.post(`${this.baseUrl}/cv/gen-theme`, data);
  }

}
