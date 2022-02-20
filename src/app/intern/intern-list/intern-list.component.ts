import { Component, OnInit } from '@angular/core';
import { Intern } from '../intern.model';
import { InternService } from '../intern.service';

@Component({
  selector: 'app-intern-list',
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.css']
})
export class InternListComponent implements OnInit {

  public internList: Intern[];

  constructor(private internService: InternService) { 
    this.internList = [];
  }

  ngOnInit(): void {
    this.internService.getInternList().subscribe((response) => {
      this.internList = response;
    })
  }

  deleteIntern(id: number) {
    this.internService.deleteIntern(id).subscribe((response) => {
      alert('Intern Deleted');
    });
  }
}
