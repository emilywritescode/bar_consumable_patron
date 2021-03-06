import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Patron {
  name: string;
  phone: string;
  city: string;
  state: string;
}

export interface Transaction {
  barName: string;
  itemName: string;
  quantity: number;
  timeStamp: string;
}

export interface Beer {
  Name: string;
  Amount: number;
}

export interface Week {
  weekNum: number;
  spent: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatronsService {

  constructor(
    public http: HttpClient
  ) { }

  getPatrons() {
    return this.http.get<Patron[]>('/api/patrons');
  }

  getPatron(patron: string) {
    return this.http.get<Patron>('/api/patrons/' + patron);
  }

  getPatronTrans(patron: string) {
    return this.http.get<Transaction[]>('/api/patrons/' + patron + 'tr');
  }

  getPatronBeers(patron: string) {
    return this.http.get<Beer[]>('/api/patrons/' + patron + 'br');
  }

  getPatronHistory(patron: string) {
    return this.http.get<Week[]>('/api/patrons/' + patron + 'hs');
  }
}
