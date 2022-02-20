import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Intern } from './intern.model';

@Injectable({
  providedIn: 'root'
})
export class InternService {

  constructor(private http: HttpClient) { }

  public getInternList(): Observable<Intern[]> {
    return this.http.get<Intern[]>('http://localhost:3000/interns');
  }

  public getInternById(id: string): Observable<Intern> {
    return this.http.get<Intern>(`http://localhost:3000/interns/${id}`);
  }

  public deleteIntern(id: number) {
    return this.http.delete(`http://localhost:3000/interns/${id}`);
  }

  public addIntern(data: Intern) {
    return this.http.post('http://localhost:3000/interns', data);
  }

  public editIntern(data: Intern, id: string) {
    return this.http.put(`http://localhost:3000/interns/${id}`, data);
  }
}
