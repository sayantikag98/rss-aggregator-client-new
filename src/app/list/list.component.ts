import { Component, OnInit, Input } from '@angular/core';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  data:any=[];

  @Input() tablecomp: TableComponent;

  constructor() { }

  
  ngOnInit(): void {
  }

  

  displayFeed(){ 
    if(this.tablecomp.dataSource.data) this.data = this.tablecomp.dataSource.data;
    console.log(this.data);
  }
}
