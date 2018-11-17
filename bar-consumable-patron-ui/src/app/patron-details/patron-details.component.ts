import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatronsService , Patron, Transaction, Beer} from '../patrons.service';

declare const Highcharts: any;


@Component({
  selector: 'app-patron-details',
  templateUrl: './patron-details.component.html',
  styleUrls: ['./patron-details.component.css']
})
export class PatronDetailsComponent implements OnInit {

  patronPhone: string;
  patronDetails: Patron;
  transactions: Transaction[];


  constructor(
    private patronService: PatronsService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
        this.patronPhone = paramMap.get('patron');
        this.patronService.getPatronTrans(this.patronPhone).subscribe(
          data => {
            this.transactions = data;
          }
        ),
        this.patronService.getPatron(this.patronPhone).subscribe(
          data => {
            this.patronDetails = data;
          },
        );
        this.patronService.getPatronBeers(this.patronPhone).subscribe(
          data => {
            const beerNames = [];
            const beerCount = [];

            data.forEach(beer => {
              beerNames.push(beer.Name);
              beerCount.push(beer.Amount);
            });

            this.renderBeersChart(beerNames, beerCount);
          }
        );
      }
    );
  }

  ngOnInit() {
  }

  renderBeersChart(beerNames: string[], beerCount: number[]) {
    Highcharts.chart('bargraph', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Beers Ordered'
      },
      xAxis: {
        categories: beerNames,
        title: {
          text: 'Beer Names'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Beers Ordered'
        },
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        data: beerCount
      }]
    });
  }
}
