import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTooltip, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";

type BarOptions = {
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

let barChartOptions: Partial<BarOptions>;

export function getBarChart(dataSeries: any[], categories: any[]) {
    return barChartOptions = {
        series: [
            {
                data: dataSeries
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
            categories: categories
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
