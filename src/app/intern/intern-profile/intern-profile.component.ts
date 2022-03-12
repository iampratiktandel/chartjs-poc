import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Intern } from '../intern.model';
import { InternService } from '../intern.service';

@Component({
  selector: 'app-intern-profile',
  templateUrl: './intern-profile.component.html',
  styleUrls: ['./intern-profile.component.css']
})
export class InternProfileComponent implements OnInit {

  // @Input() public internList: Intern[] | undefined;
  @Input() public title: string;
  
  
  @Input() public set internList(value : any) {
    console.log(value);
    this._internList = value;
  }
  public get internList() : any {
    return this._internList;
  }
  
  public internData!: Intern;
  public id!: string;

  private _internList: any;

  constructor(
    private internService: InternService,
    private activatedRoute: ActivatedRoute
  ) { 
    // console.log(this.activatedRoute);
    // this.id = this.activatedRoute.snapshot.params.id;
    // console.log(this.id)
    this.title = '';
    this.internList = [];
    console.log(this.title)
  }

  ngOnInit(): void {
    // this.internService.getInternById(this.id).subscribe((res) => {
    //   this.internData = res;
    //   console.log(this.internData);
    // })
    // let data = this.internList;
    // console.log(data);
    console.log(this.internList);
    console.log(this.title)
  }
}
