import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Intern } from '../intern.model';
import { InternService } from '../intern.service';

@Component({
  selector: 'app-intern-profile',
  templateUrl: './intern-profile.component.html',
  styleUrls: ['./intern-profile.component.css']
})
export class InternProfileComponent implements OnInit {

  public internData!: Intern;
  public id!: string;

  constructor(
    private internService: InternService,
    private activatedRoute: ActivatedRoute
  ) { 
    console.log(this.activatedRoute);
    this.id = this.activatedRoute.snapshot.params.id;
    console.log(this.id)
  }

  ngOnInit(): void {
    this.internService.getInternById(this.id).subscribe((res) => {
      this.internData = res;
      console.log(this.internData);
    })
  }
}
