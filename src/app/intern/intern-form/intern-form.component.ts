import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Input() public set internData(value: any) {
    console.log(value)
    if (value) {
      this.isEditMode = true;
      this.internForm.patchValue(value);
      this._internData = value;
    }
  }
  public get internData(): any {
    return this._internData;
  }

  @Output() public add: EventEmitter<Intern>;
  @Output() public edit: EventEmitter<Intern>;

  public internForm: FormGroup;
  public id!: string;
  public isEditMode: boolean;

  private _internData: any;

  constructor(
    private fb: FormBuilder,
  ) {
    this.internForm = this.fb.group({
      name: [],
      email: [],
    })
    this.isEditMode = false;
    this.add = new EventEmitter();
    this.edit = new EventEmitter();
  }

  ngOnInit(): void {
  }

  public onAdd() {
    this.add.emit(this.internForm.value);
  }

  public onEdit() {
    this.edit.emit(this.internForm.value);
  }
}
