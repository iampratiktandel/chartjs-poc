import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-intern-list',
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.css']
})
export class InternListComponent implements OnInit {

  @Input() public set internList(value : any) {
    this._internList = value;
  }
  public get internList() : any {
    return this._internList;
  }

  @Output() public delete: EventEmitter<number>;
  @Output() public showForm: EventEmitter<string>;
  private _internList: any;

  constructor() { 
    this.delete = new EventEmitter();
    this.showForm = new EventEmitter();
  }

  ngOnInit(): void {
  
  }

  deleteIntern(id: number) {
    this.delete.emit(id);
  }

  onEdit(id: string) {
    this.showForm.emit(id);
  }
}
