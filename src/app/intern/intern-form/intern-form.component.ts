import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Intern } from '../intern.model';
import { InternService } from '../intern.service';

@Component({
  selector: 'app-intern-form',
  templateUrl: './intern-form.component.html',
  styleUrls: ['./intern-form.component.css']
})
export class InternFormComponent implements OnInit {

  public internForm: FormGroup;
  public id!: string;
  public isEditMode: boolean;

  constructor(private internService: InternService, private fb: FormBuilder
    , private router: Router, private activatedRoute: ActivatedRoute
    ) {
    this.internForm = this.fb.group({
        name: [],
        email: [],
        // mobile: [],
        // city: [],
        // gender: [],
        // department: [],
        // hireDate: [],
        // permanent: true
    })
    this.id = this.activatedRoute.snapshot.params.id;
    this.isEditMode = false;
  }

  ngOnInit(): void {
    if(this.id) {
      this.isEditMode = true;
      this.internService.getInternById(this.id).subscribe((res) => {
        // this.internForm.setValue({
        //   name: res.name,
        //   email: res.email
        // })

        // this.internForm.patchValue({
        //   name: res.name
        // })

        this.internForm.patchValue(res);
        console.log(this.id)
      })
    }
  }

  addIntern() {
    this.internService.addIntern(this.internForm.value).subscribe((res) => {
      this.router.navigateByUrl('intern/list');
      alert('Intern added');
    })
  }

  editIntern() {
    this.internService.editIntern(this.internForm.value, this.id).subscribe((res) => {
      this.router.navigateByUrl('intern/list');
      alert('Intern edited');
    })
  }
}
