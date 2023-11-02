import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, ApexLegend } from 'ng-apexcharts';
import { combineLatest } from 'rxjs';
import { PwaService } from 'src/app/services/pwa/pwa.service';
import { TokenService } from 'src/app/services/token/token.service';
import { defaultUser } from 'src/app/services/user/user.interface';
import { UserService } from 'src/app/services/user/user.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
  legend: ApexLegend;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
  name: string = '';
  isInstallPWA = false;
  installPrompt: any;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(
    private user: UserService,
    private token: TokenService,
    private router: Router,
    private pwaService: PwaService
  ) {
    this.pwaService.getInstallPWA.subscribe(res => {
      this.isInstallPWA = res
    })
    this.chartOptions = {
      series: [
        {
          data: [400, 430, 448, 470]
        }
      ],
      chart: {
        type: "bar",
        height: 380,
        toolbar: {
          tools: {
            download: false,
          }
        }
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom"
          }
        }
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7"
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [
          "Partai 1",
          "Partai 2",
          "Partai 3",
          "Partai 4",        ]
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        enabled: false
      },
    };
  }

  ngOnInit() {
    combineLatest([
      this.user.getUser,
      this.token.getToken
    ]).subscribe(res => {
      this.name = res[0].name
      console.log(res);
    })
  }

  gotoPage(ev: number) {
    this.router.navigate(['candidate/' + ev]);
  }

  handleScrollStart(ev: any) {
    console.log(ev);
  }

  public exitAppButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: async () => {
        this.token.updateToken('');
        this.user.updateUser(defaultUser);
        await this.router.navigate(['/login']);
      },
    },
  ];

  async installPWA() {
    this.pwaService.getInstallPrompt
      .subscribe({
        next: (installPrompt) => (
          installPrompt.prompt(),
          installPrompt.userChoice,
          this.pwaService.updateInstallPWA(false)
        ),
        complete: () => this.pwaService.updateInstallPrompt(null)
      })
  }
}
