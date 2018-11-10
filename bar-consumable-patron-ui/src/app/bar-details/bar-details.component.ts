import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarsService, Bar, FoodItem } from '../bars.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-bar-details',
  templateUrl: './bar-details.component.html',
  styleUrls: ['./bar-details.component.css']
})
export class BarDetailsComponent implements OnInit {

        barLicense: string;
        barDetails: Bar;
        barFoods: FoodItem[];

  constructor(private barService: BarsService, private route: ActivatedRoute) {
          route.paramMap.subscribe((paramMap) => {
                  this.barLicense = paramMap.get('bar');
                  
                  barService.getBar(this.barLicense).subscribe(
                          data => 
                          { this.barDetails = data; },
                          (error: HttpResponse<any>) => {
                                  if(error.status === 404){
                                          alert('Bar not found!');
                                  } else {
                                          console.error(error.status + ' : ' + error.body);
                                          alert('An error occurred!');
                                  }
                          }
                  );
                  
                  barService.getFoodMenu(this.barLicense).subscribe(
                          data => 
                          { this.barFoods = data; },
                          (error: HttpResponse<any>) => {
                                  if(error.status === 404){
                                          alert('Bar doesn\'t sell any foods!');
                                  } else {
                                          console.error(error.status + ' : ' + error.body);
                                          alert('An error occurred!');
                                  }
                          }
                  );
          });
  }

  ngOnInit() {
  }

}
