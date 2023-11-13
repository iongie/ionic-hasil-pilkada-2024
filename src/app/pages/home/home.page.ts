import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, ApexLegend } from 'ng-apexcharts';
import { Subject, combineLatest, concatMap, delay, takeUntil, tap } from 'rxjs';
import { getBarChart } from 'src/app/app.chart';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
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
  dapil: string = '';
  isInstallPWA = false;
  installPrompt: any;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private destroy: Subject<void> = new Subject<void>();
  barLoading: boolean = true;
  resultDPDLoading: boolean = true;
  constructor(
    private user: UserService,
    private tokenServ: TokenService,
    private router: Router,
    private pwaService: PwaService,
    private callApiServ: CallApiService
  ) {
    this.pwaService.getInstallPWA.subscribe(res => {
      this.isInstallPWA = res
    })
    this.chartOptions = getBarChart(['500 suara', '430 suara', '428 suara', '410 suara'], ["PKB", "PKS", "NASDEM", "GOLKAR"])
  }

  ngOnInit() {
    combineLatest([
      this.user.getUser,
      this.tokenServ.getToken
    ]).subscribe(res => {
      this.name = res[0].name
      this.dapil = res[0].dapil[0]
    })
    this.getDataBarChart();
    this.getDataRankingDPD();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  gotoPage(ev: number) {
    this.router.navigate(['candidate/' + ev]);
  }

  handleScrollStart(ev: any) {
  }

  getDataBarChart(){
    return combineLatest([
      this.tokenServ.getToken
    ]).pipe(
      takeUntil(this.destroy),
      delay(1000),
      concatMap(([token]) => {
        return this.callApiServ.get('param/', token)
      }),
      tap(()=> this.barLoading = false),
    )
      .subscribe({
        error: (e) => this.barLoading = true,
        next: (res: any) => (
          getBarChart(res.dataSeries, res.categories)
        )
      })
  }

  getDataRankingDPD(){
    return combineLatest([
      this.tokenServ.getToken
    ]).pipe(
      takeUntil(this.destroy),
      delay(1000),
      concatMap(([token]) => {
        return this.callApiServ.get('param/', token)
      }),
      tap(()=> this.resultDPDLoading = false),
    )
      .subscribe({
        error: (e) => this.resultDPDLoading = true,
        next: (res: any) => (
          getBarChart(res.dataSeries, res.categories)
        )
      })
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
        this.tokenServ.updateToken('');
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
