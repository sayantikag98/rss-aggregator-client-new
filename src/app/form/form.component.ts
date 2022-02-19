import { Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { TableComponent } from '../table/table.component';
import { FormGroupDirective } from '@angular/forms';

@Component({
  providers: [ApiService],
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  newFeedForm !: FormGroup;
  actionBtn : string = "Create";
  
  @Input() tablecomp: TableComponent;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(private formBuilder: FormBuilder, private api: ApiService) { }
  


  ngOnInit(): void {
    this.newFeedForm = this.formBuilder.group({
      feedUrl: ["", Validators.required]
    });
  }

  addOrEditFeed(){
    this.tablecomp.addOrEditFeed();
  }

}


