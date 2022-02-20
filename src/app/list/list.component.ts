import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ApiService } from '../services/api.service';
import { Detail } from '../detail.model';
import { mergeMap } from 'rxjs';

import * as $ from 'jquery';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  

  data:any= [];
  feedDetails: any= [];
  objList:any = [];


  @Input() tablecomp: TableComponent;

  

  constructor(private api: ApiService) {
  }

  
  ngOnInit(): void {
    this.getFeedDetails();
  }

  getDiffArray(arr1: any, arr2: any){
    return arr1.filter((ele:any) => !arr2.some((ele1: any) => ele.feedTitle === ele1.feedTitle));
  }

  getData(feedUrl: string){
    const thisComp = this;
    $.ajax(feedUrl, {
      async: false,
      accepts: {
        xml: "application/rss+xml"
      },
    
      dataType: "xml",
      success: function(data) {
       const feedAuthor = $(data).find("channel").children("title").text();
       
        $(data).find("item").each(function() {
            const el = $(this), feedTitle = $(el).find("title").text(), 
            feedDate = new Date(el.find("pubDate").text()).toLocaleString(), feedDescription = $(el).find("description").text(),
            obj = {feedDate, feedTitle, feedAuthor, feedDescription, feedUrl};
            thisComp.objList.push(obj);   
          });

      },
      error: function(){
        alert("Please check the feed url");
      }
    });
  }


  compare(a:any, b:any){
    return (a.feedDate >= b.feedDate) ? 1 : -1;
  }

  getFeedDetails(){
    this.api.getFeedDetails()
    .subscribe(res => {
      this.feedDetails = res;
      this.displayFeed();
    })
  }

  renderContent(){
    const feedDiv = document.getElementById("feed-detail-div");
    if(feedDiv !== null) feedDiv.remove();
    this.objList = this.objList.sort((a:Detail, b:Detail) => {
      return Date.parse(b.feedDate) - Date.parse(a.feedDate);
    });
    const feedDetailEle = document.createElement("div");
    feedDetailEle.id = "feed-detail-div";
    this.objList.forEach((ele: any) => {
                const template = `
                    <article>
                      <h1>${ele.feedTitle}</h1>
                      <h2>${ele.feedAuthor}</h2>
                      <h3>${ele.feedUrl}</h3>
                      <h4>${ele.feedDate}</h4>
                      <p>${ele.feedDescription}</p>
                      <hr>
                    </article>
                  `;
                  feedDetailEle.insertAdjacentHTML("beforeend", template);
              });
    document.body.insertAdjacentElement("beforeend", feedDetailEle);
    
  }


  displayFeed(){ 
    if(this.tablecomp.dataSource.data) this.data = this.tablecomp.dataSource.data.map((ele:any) => ele = ele.feedUrl);
    this.objList = [];
    
    if(this.data.length) this.data.forEach( (urlItem: string) => {
      this.getData(urlItem); 
    });

    else this.objList = [];


    this.renderContent();


    // diff1 is the feed detail stored in the database
    const diff1 = this.getDiffArray(this.feedDetails, this.objList); // feed details not to be included
    //diff2 is the updated data obtained after parsing the current feed urls
    const diff2 = this.getDiffArray(this.objList, this.feedDetails); // feed details to be included


    if(diff2.length){
      diff2.forEach((ele: any) => {
        this.api.postFeedDetail(ele)
        .subscribe(() => {});
      }) 
    }

    if(diff1.length){
      diff1.forEach((ele: any) => {
        this.api.deleteAllFeedDetails(ele._id)
        .subscribe(()=>{});
      })
    }
    

    

    
  }

  
}
