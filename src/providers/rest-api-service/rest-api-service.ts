import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RestApiServiceProvider {

  public infoData: any;
  public kpiData: any;
  public statusData: any;
  public ecosystemData: any;
  public dateArg: any;
  public systemArg: any;
  public variableArg: any;
  public currentUser: User;
  
  constructor(public http: Http) {
    console.log('Inside RestApiServiceProvider Provider');
  }

getKPIData(dateArg, systemArg, variableArg) 
  {
    return new Promise(
      resolve => {
      this.http
      .get('http://192.168.43.34:8080/UBBAppRestWebService/REST/method3StringArgument/'+dateArg+'/'+systemArg+'/'+variableArg)  
      .map(res => res.json())
      .subscribe(data => {
          this.kpiData = data;
          resolve(this.kpiData);
        });
      }
    );
  }


getOverallStatusData(dateArg, systemArg, variableArg) 
  {    
   return new Promise(resolve => {
     this.http.get('http://192.168.43.34:8080/UBBAppRestWebService/REST/method3StringArgument/'+dateArg+'/'+systemArg+'/'+variableArg)  
      .map(res => res.json())
         .subscribe(data => {
          this.statusData = data;
           resolve(this.statusData);
        });
    });
  }


getInfoPageData(dateArg, systemArg, variableArg) 
  {
    return new Promise(resolve => {
      this.http.get('http://192.168.43.34:8080/UBBAppRestWebService/REST/method3StringArgument/'+dateArg+'/'+systemArg+'/'+variableArg)  
      .map(res => res.json())
        .subscribe(data => {
          this.infoData = data;
          resolve(this.infoData);
        });
    });
  }


getEcosystemData(dateArg, systemArg, variableArg) 
  {  
  return new Promise(resolve => {
      this.http.get('http://192.168.43.34:8080/UBBAppRestWebService/REST/method3StringArgument/'+dateArg+'/'+systemArg+'/'+variableArg)  
      .map(res => res.json())
        .subscribe(data => {
          this.ecosystemData = data;
          resolve(this.ecosystemData);
        });
    });
  
  // this.ecosystemData = [
  //     {
  //     name:'IPDR',
  //     items: [
  //       {Date:'20170626',KPIName:'i1-% of CMTS Assigned to Each Pump v/s Configuration Data',Profileid:'NETW_018',ChartType:'doughnut',ColorStatus:'green',datatype:'Percent',KPIValue1:'79.93',KPIValue2:'3200',KPIValue3:'3500',KPIValue4:'0',KPIValue5:'0',TitleString:'CMTS Configuration in Sync',ThresholdYellow:'99.50',"ThresholdRed":'99.00'},
  //       {Date:'20170626',KPIName:'i2-Average IPDR Data Collections per Hour for CMTS Supporting IPDRSP',Profileid:'NETW_013',ChartType:'doughnut',ColorStatus:'green',datatype:'min',KPIValue1:'3.99',KPIValue2:'2889',KPIValue3:'0',KPIValue4:'0',KPIValue5:'0',TitleString:'times IPDR data collected per hour',ThresholdYellow:'3.9',"ThresholdRed":'3.8'},
  //       {Date:'20170626',KPIName:'Aggregate Rollup file completeness',Profileid:'NETW_019',ChartType:'pie',ColorStatus:'green',datatype:'Percent',KPIValue1:'99.59',KPIValue2:'68934',KPIValue3:'69214',KPIValue4:'0',KPIValue5:'0',TitleString:'Files',ThresholdYellow:'99.00',"ThresholdRed":'95.00'},
  //       {Date:'20170626',KPIName:'Time taken for Complete Rollup and Delivery to EM&M',Profileid:'NETW_016',ChartType:'bar',ColorStatus:'red',datatype:'Min',KPIValue1:'5/0',KPIValue2:'60',KPIValue3:'30',KPIValue4:'70',KPIValue5:'0',TitleString:'Maximum time taken is',ThresholdYellow:'105',"ThresholdRed":'115',extraval1:'74',extraval2:'95'},
  //     ]
  //     },
  //     {
  //     name:'EMM',
  //     items: [
  //       {Date:'20170626',KPIName:'M1-% of Records Processed at EM&M Load Balancer',Profileid:'NOTIF_027',ChartType:'line',ColorStatus:'green',datatype:'Percent',KPIValue1:'99.35',KPIValue2:'1009195197',KPIValue3:'1015765485',KPIValue4:'0',KPIValue5:'0',TitleString:'Usage Records',ThresholdYellow:'93.00',"ThresholdRed":'90.00'},
  //       {Date:'20170626',KPIName:'% of Processed Usage Records at EM&M',Profileid:'NOTIF_021',ChartType:'doughnut',ColorStatus:'green',datatype:'Percent',KPIValue1:'',KPIValue2:'1006529532',KPIValue3:'1006753911',KPIValue4:'0',KPIValue5:'0',TitleString:'Usage Records',ThresholdYellow:'99.00',"ThresholdRed":'98.50'},
  //     ]
  //     },
  //     {
  //     name:'Notification',
  //     items: [
  //       {Date:'20170626',KPIName:'N1-% Notification Sent Across between EM&M and MMgr',Profileid:'NOTIF_019',ChartType:'doughnut',ColorStatus:'green',datatype:'Percent',KPIValue1:'99.99',KPIValue2:'49692',KPIValue3:'49694',KPIValue4:'0',KPIValue5:'0',TitleString:'Notifications',ThresholdYellow:'99.50',"ThresholdRed":'99.00'},
  //       {Date:'20170626',KPIName:'% Notification Sent Across in <1 hr between EM&M and MMgr',Profileid:'NOTIF_017',ChartType:'doughnut',ColorStatus:'green',datatype:'Percent',KPIValue1:'100.00',KPIValue2:'49692',KPIValue3:'49692',KPIValue4:'0',KPIValue5:'0',TitleString:'Notifications',ThresholdYellow:'99.50',"ThresholdRed":'99.00'},
  //     ]
  //     },
  //     {
  //     name:'User & Billing',
  //     items: [
  //       {Date:'20170626',KPIName:'% of MyAccount Available Time',Profileid:'USER_004',ChartType:'doughnut',ColorStatus:'green',datatype:'Percent',KPIValue1:'99.33',KPIValue2:'0',KPIValue3:'0',KPIValue4:'0',KPIValue5:'0',TitleString:'% of MyAccount Available Time',ThresholdYellow:'99.00',"ThresholdRed":'98.50'},
  //       {Date:'20170626',KPIName:'% of Customers can See Usage Meter',Profileid:'USER_006',ChartType:'doughnut',ColorStatus:'green',datatype:'Percent',KPIValue1:'100',KPIValue2:'14',KPIValue3:'14',KPIValue4:'0',KPIValue5:'0',TitleString:'Successful Attempts',ThresholdYellow:'80.00',"ThresholdRed":'75.00'},
  //     ]
  //     },
  //     {
  //     name:'Order Management',
  //     items: [
  //       {Date:'20170626',KPIName:'% of Success of Device Writeback of HSD Residential Orders',Profileid:'ACCT_005',ChartType:'doughnut',ColorStatus:'yellow',datatype:'Percent',KPIValue1:'99.9',KPIValue2:'51275',KPIValue3:'51324',KPIValue4:'0',KPIValue5:'0',TitleString:'Orders with Successful Device Writeback',ThresholdYellow:'97.00',"ThresholdRed":'95.00'},
  //     ]
  //     }   
  //   ];
  //   return this.ecosystemData;
  }

getLogin(credentials) 
  {
    if (credentials.userId === null || credentials.password === null) {
      return Observable.throw("Please enter your credentials");
    } 
    else {
      console.log("I am Inside getLogin");
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "appuser" && credentials.userId === "appuser");
        this.currentUser = new User('appuser', 'appuser');
        observer.next(access);
        observer.complete();
      });
    }
  } 
  
}

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
} 