import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TableComponent } from '../table/table.component';
import axios from 'axios';

@Component({
  providers: [TableComponent],
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  data:any;

  constructor(private tableComp: TableComponent) { }

  async getData (){
    const response = await axios.get("http://localhost:3000/");
    this.data = response.data;
    this.data = this.data.map((ele:any) => ele = ele.feedUrl);
  }

  ngOnInit(): void {
    this.getData();
  }

  

  displayFeed(){ 
    console.log(this.data);
  }
}
