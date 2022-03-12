import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Intern } from './intern.model';
import { InternService } from './intern.service';

@Component({
  selector: 'app-intern',
  templateUrl: './intern.component.html',
  styleUrls: ['./intern.component.css']
})
export class InternComponent implements OnInit {

  public internList: Intern[] | undefined;
  public internData: Intern | undefined;
  public internId!: string;

  public isForm: boolean;

  constructor(
    private internService: InternService,
    private router: Router
  ) { 
    this.isForm = false;
  }

  ngOnInit(): void {
    this.internService.getInternList().subscribe((response) => {
      this.internList = response;
      console.log(this.internList)
    })
  }

  public delete(id: number) {
    console.log(id);
    this.internService.deleteIntern(id).subscribe((response) => {
      alert('Intern Deleted');
    });
  }

  add(internForm: Intern) {
    this.internService.addIntern(internForm).subscribe((res) => {
      this.router.navigateByUrl('intern/list');
      this.isForm = false;
      alert('Intern added');
    })
  }

  edit(internForm: Intern) {
    this.internService.editIntern(internForm, this.internId).subscribe((res) => {
      this.router.navigateByUrl('intern/list');
      alert('Intern edited');
    })
  }

  public showForm() {
    this.isForm = true;
  }

  public showEditForm(id: string) {
    this.isForm = true;

    this.internId = id;
    this.internService.getInternById(id).subscribe((res) => {
      console.log(res);
      this.internData = res;
    })
  }
}
