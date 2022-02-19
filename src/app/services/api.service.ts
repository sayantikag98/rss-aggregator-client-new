import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) {}

  postFeed(data:any){
    return this.http.post("http://localhost:3000/", data, {responseType: 'text'}); // dont put <any> here and putting response type is important otherwise throws error
  }

  getFeeds(){
    return this.http.get("http://localhost:3000/");
  }

  updateFeed(id:any, data:any){
    return this.http.put(`http://localhost:3000/${id}`, data, {responseType: 'text'});
  }

  deleteFeed(id:any){
    return this.http.delete(`http://localhost:3000/${id}`, {responseType: 'text'});
  }

  getFeedDetails(){
    return this.http.get("http://localhost:3000/details/");
  }

  postFeedDetail(data: any){
    return this.http.post("http://localhost:3000/details/", data, {responseType: 'text'});
  }

  deleteAllFeedDetails(){
    return this.http.delete("http://localhost:3000/details/", {responseType: 'text'});
  }
}
