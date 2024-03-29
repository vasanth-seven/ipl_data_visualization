// global.fetch = require("node-fetch");




function fetchAndVisualizeData() {
    fetch("./data.json")
      .then(r => r.json())
      .then(visualizeData);
  }
  
  fetchAndVisualizeData();
  
  function visualizeData(data) {
    visualizeMatchesPlayedPerYear(data.matchesPlayedPerYear);
    visualizeMatchesWonPerYear(data.matchesWonPerYear);
    visualizeExtraruns(data.extraRunsIn2016);
    visualizeEconomicalBowlers(data.economicalBowlersEachYear[2016]);
    visualizeEconomicalEachYear(data.economicalBowlersEachYear[2011],2011);
    visualizeTeamWinsPerVenue(data.teamWinsperVenue);
    return;
  }
  
  function visualizeMatchesPlayedPerYear(matchesPlayedPerYear) {
    const seriesData = [];
    for (let year in matchesPlayedPerYear) {
      seriesData.push([year, matchesPlayedPerYear[year]]);
    }
  
    Highcharts.chart("matches-played-per-year", {
      chart: {
        type: "column"
      },
      title: {
        text: "Matches Played Per Year"
      },
      subtitle: {
        text:
          'Source: <a href="https://www.kaggle.com/nowke9/ipldata/data">IPL Dataset</a>'
      },
      xAxis: {
        type: "category"
      },
      yAxis: {
        min: 0,
        title: {
          text: "Matches"
        }
      },
      legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Matches: <b>{point.y:.0f}</b>'
    },
      series: [
        {
          name: "Years",
          data: seriesData
        }
      ]
    });
  }




  function visualizeMatchesWonPerYear(matchesWonPerYear){
  
    let categories=[]
    let series=[]
    let teams=[]
    let team_wins=[]
    for(let year in matchesWonPerYear){
        // console.log(year)
        for(let team in matchesWonPerYear[year]){
          if(!teams.includes(team) )
          teams.push(team) 
        } 
        categories.push(year)
    }
    // console.log(categories)
      for(let team of teams){ 
        let temp=[]
        
          for(let year of categories){
            
            
            if(matchesWonPerYear[year][team]){
                temp.push(matchesWonPerYear[year][team])
            }
            else
            temp.push(0)
          }
          team_wins.push(temp)        
      }
      for(let team in teams){
        let temp_Obj={}
        temp_Obj["name"]=teams[team]
        temp_Obj["data"]=team_wins[team]  
        series.push(temp_Obj)
      }
      // console.log(series)
    // console.log(team_wins,teams)
    Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'The number of matches won by each team over all the years of IPL.'
      },
      subtitle: {
          text: 'Source: <a href="https://www.kaggle.com/nowke9/ipldata/data">IPL Dataset</a>'
      },
      xAxis: {
          categories: categories,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'matches'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: series
  });
  }


  function visualizeExtraruns(extraRunsIn2016) {
    const seriesData = [];
    for (let extras in extraRunsIn2016) {
      seriesData.push([extras, extraRunsIn2016[extras]]);
    }
  
    Highcharts.chart('extra_runs', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'extra runs conceded by each team'
      },
      subtitle: {
          text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
      },
      xAxis: {
          type: 'category',
          labels: {
              rotation: -45,
              style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
              }
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Extras'
          }
      },
      legend: {
          enabled: false
      },
      tooltip: {
          pointFormat: 'Extras: <b>{point.y:.0f}</b>'
      },
      series: [{
          name: 'Extras',
          data: seriesData,
          dataLabels: {
              enabled: true,
              rotation: 0,
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y:.0f}', // one decimal
              y: 20, // 10 pixels down from the top
              style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
              }
          }
      }]
  });
  }


  function visualizeEconomicalBowlers(economicalBowlersOf2015){

    const data=Object.entries(economicalBowlersOf2015);
    // console.log(data)
    Highcharts.chart('economical', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
      },
      title: {
          text: 'Top<br>Economical bowlers of<br>2015',
          align: 'center',
          verticalAlign: 'middle',
          y: 60
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              dataLabels: {
                  enabled: true,
                  distance: -50,
                  style: {
                      fontWeight: 'bold',
                      color: 'white'
                  }
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '75%'],
              size: '110%'
          }
      },
      series: [{
          type: 'pie',
          name: 'Economical Bowlers',
          innerSize: '50%',
          data: [
              ...data,
          ]
      }]
  });


  }


  let selectButton=document.getElementById("select-button")
  let yearSelected=document.getElementById("select-container");

  selectButton.onclick=()=>{
    fetchEconomical(yearSelected.value)
  }
  function fetchEconomical(year){
      let url="https://ipl-economy-data-server.herokuapp.com/economy/"
      url+=year;
  fetch(url)
      .then(r => r.json())
      .then(data=>visualizeEconomicalEachYear(data,year))  
  }

  function visualizeEconomicalEachYear(economicalBowlersOf2015,year){
    
    
    console.log(year)
      const data=Object.entries(economicalBowlersOf2015);
    // console.log(data)
    Highcharts.chart('economical-year', {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
      },
      title: {
          text: `Top<br>Economical bowlers of<br>${year}`,
          align: 'center',
          verticalAlign: 'middle',
          y: 60
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              dataLabels: {
                  enabled: true,
                  distance: -50,
                  style: {
                      fontWeight: 'bold',
                      color: 'white'
                  }
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '75%'],
              size: '110%'
          }
      },
      series: [{
          type: 'pie',
          name: 'Economical Bowlers',
          innerSize: '50%',
          data: [
              ...data,
          ]
      }]
  });
  


  }
function visualizeTeamWinsPerVenue(teamWinsperVenue){
    let series=[]
    let stadiums=[]
    let teams=[]
    
    for(let venue in teamWinsperVenue){
        stadiums.push(venue) 
        for (let team  in  teamWinsperVenue[venue]){
            if(!teams.includes(team) && team!="")
            teams.push(team)
        }
    }
    for(team of teams){
        // console.log(team)
        let obj={}
        obj["name"]=team;
        obj["data"]=[];
        for(let stadium of stadiums){
            if(teamWinsperVenue[stadium].hasOwnProperty(team))   {
                obj["data"].push(teamWinsperVenue[stadium][team])
            }
            else{
                obj["data"].push(0);
            }
        }
        series.push(obj)
    }
    
    



    Highcharts.chart('venue-wins', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Matches won by each team per venue'
        },
        xAxis: {
            categories: stadiums
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total matches won'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });
          


}
  
