import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Beer {
        name: string;
        manufacturer: string;
        type: string;
}
export interface Bar{
        license: string;
        barName: string;
        price: number;
}


@Injectable({
  providedIn: 'root'
})
export class BeersService {

  constructor(public http: HttpClient) { }
  getBeers(){
          return this.http.get<Beer[]>('/api/beer');
  }
  getBeer(beer: string){
          return this.http.get<Beer>('/api/beer/' + beer);
  }
  listBars(beer: string){
          return this.http.get<Bar[]>('/api/beer/' + beer + '/listbars');
  }
}
