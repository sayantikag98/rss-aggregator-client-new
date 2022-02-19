import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ApiService } from '../services/api.service';

import * as $ from 'jquery';

import axios from 'axios';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  

  data:any= [];
  feedDetails: any;


  @Input() tablecomp: TableComponent;

  

  constructor(private api: ApiService, private _element: ElementRef) {
  }

  
  ngOnInit(): void {
    
  }

  async getData(feedUrl: string){
    const response = await axios(feedUrl);
    const info = response.data; 
  }

  getFeedDetails(){
    this.api.getFeedDetails()
    .subscribe({
      next: res => {
        this.feedDetails = res;
        console.log("Feed details were successfully fetched from the database");
      },
      error: () => {
        console.log("Error in getting all the details");
      }
    })
  }

  addFeedDetail(feedData: any){
    this.api.postFeedDetail(feedData)
    .subscribe({
      next: res => {
        console.log("Feed detail added successfully to the database");
      },
      error: () => {
        console.log("Error in adding the feed detail to the database");
      }
    })
  }

  deleteAllFeedDetails(){
    this.api.deleteAllFeedDetails()
    .subscribe({
      next: res => {
        console.log(res);
        console.log("All feed details removed from the database");
      },
      error: () => {
        console.log("Error in removing all the feed details from the database");
      }
    })
  }

  getData1(feedUrl: string){
    this.deleteAllFeedDetails();
    const thisComp = this;
    const pushDetails = this.addFeedDetail;
    $.ajax(feedUrl, {
      accepts: {
        xml: "application/rss+xml"
      },
    
      dataType: "xml",
      success: function(data) {
       const feedAuthor = $(data).find("channel").children("title").text();
       const objList:any[] = [];
        $(data).find("item").each(function() {
            const el = $(this), feedTitle = $(el).find("title").text(), 
            feedDate = new Date(el.find("pubDate").text()).toLocaleString(), feedDescription = $(el).find("description").text(),
            obj = {feedDate, feedTitle, feedAuthor, feedDescription, feedUrl};

            const template = `
              <article>
                <h1>${feedTitle}</h1>
                <h2>${feedAuthor}</h2>
                <h3>${feedUrl}</h3>
                <h4>${feedDate}</h4>
                <p>${feedDescription}</p>
                <hr>
              </article>
            `;
            objList.push(obj);
            document.body.insertAdjacentHTML("beforeend", template);
          });
          objList.forEach((ele: any) => {
            thisComp.addFeedDetail(ele);
          });
      }
    });
  }

  compare(a:any, b:any){
    return (a.feedDate >= b.feedDate) ? 1 : -1;
  }


  displayFeed(){ 
    if(this.tablecomp.dataSource.data) this.data = this.tablecomp.dataSource.data.map((ele:any) => ele = ele.feedUrl);
    if(this.data.length) this.data.forEach( (urlItem: string) => {
      this.getData1(urlItem);
    });
  }

  
}
