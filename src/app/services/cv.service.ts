import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../utils/http-client-auth';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  baseEndpoint = 'cv';

  constructor(private http: HttpClientAuth) {
    console.log(http.idToken)
  }

  generateCv(data: any) {
    return this.http.post(`${this.baseEndpoint}/gen-theme`, data);
  }

  getAllCvs() {
    return this.http.get(`${this.baseEndpoint}/get-all-cv-data`);
  }

  getCvById(id: number) {
    return this.http.get(`${this.baseEndpoint}/${id}`);
  }

  updateCvById(id: number, data: any) {
    return this.http.put(`${this.baseEndpoint}/${id}`, data);
  }
}
