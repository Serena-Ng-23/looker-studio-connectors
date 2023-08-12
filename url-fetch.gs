function getAuthType(){
  var cc =DataStudioApp.createCommunityConnector();
  return cc.newAuthTypeResponse().setAuthType(cc.AuthType.OAUTH2).build();
}
function resetAuth() {
  getOAuthService().reset();
}
function isAuthValid(){
  return getOAuthService().hasAccess();
}
function getOAuthService() {
  return OAuth2.createService('GreedyGame')
    .setAuthorizationBaseUrl('xxxxxxxxxxxxxxxxxxxxxxxxxx')/// API url authentication
    .setTokenUrl('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')/// API url token
    .setClientId('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com')//// FIND IT IN YOUR PROJECT IN GOOGLE CLOUD
    .setClientSecret('XXXXXXXXXXXXXXXXXXXXXXX')////FIND IT IN YOUR PROJECT IN GOOGLE CLOUD
    .setGrantType('client_credentials')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setParam('login_hint', Session.getActiveUser().getEmail());
};
function get3PAuthorizationUrls() {
  return getOAuthService().getAuthorizationUrl();
}
function authCallback(request) {
  var service = getOAuthService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}
function getConfig(){
  var cc =DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();
  if(isAuthValid()){
    config
    .newInfo()
    .setId('instructions')
    .setText(
      'CREATE SMAATO CONNECTOR'
    );
    config.setDateRangeRequired(true);
  }else{
      get3PAuthorizationUrls();
  }
  Logger.log(config);
  return config;
}
function getFields(){ 
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;
  fields.newDimension().setId("Date").setName("Date").setType(types.YEAR_MONTH_DAY);
  fields.newDimension().setId("ApplicationId").setName("ApplicationId").setType(types.TEXT);
  fields.newDimension().setId("ApplicationType").setName("ApplicationType").setType(types.TEXT);
  fields.newDimension().setId("AdspaceId").setName("AdspaceId").setType(types.TEXT);
  fields.newDimension().setId("CountryCode").setName("CountryCode").setType(types.TEXT);
  fields.newDimension().setId("LineItemId").setName("LineItemId").setType(types.TEXT);
  fields.newDimension().setId("LineItemType").setName("LineItemType").setType(types.TEXT);
  fields.newDimension().setId("OrderId").setName("OrderId").setType(types.TEXT);
  fields.newDimension().setId("AdvertiserId").setName("AdvertiserId").setType(types.TEXT);
  fields.newDimension().setId("CreativeId").setName("CreativeId").setType(types.TEXT);
  fields.newDimension().setId("DealId").setName("DealId").setType(types.TEXT);
  fields.newDimension().setId("DemandPartnerId").setName("DemandPartnerId").setType(types.TEXT);
  fields.newMetric().setId("incomingAdRequests").setName("incomingAdRequests").setType(types.NUMBER).setAggregation(aggregations.SUM);
  fields.newMetric().setId("servedAds").setName("servedAds").setType(types.NUMBER).setAggregation(aggregations.SUM);
  fields.newMetric().setId("impressions").setName("impressions").setType(types.NUMBER).setAggregation(aggregations.SUM);
  fields.newMetric().setId("clicks").setName("clicks").setType(types.NUMBER).setAggregation(aggregations.SUM);
  fields.newMetric().setId("CTR").setName("CTR").setType(types.NUMBER).setAggregation(aggregations.AVG);
  fields.newMetric().setId("eCPM").setName("eCPM").setType(types.NUMBER).setAggregation(aggregations.AVG);
  fields.newMetric().setId("grossRevenue").setName("grossRevenue").setType(types.NUMBER).setAggregation(aggregations.SUM);
  fields.newMetric().setId("fillrate").setName("fillrate").setType(types.NUMBER).setAggregation(aggregations.AVG);
  fields.setDefaultDimension("Date");
  fields.setDefaultMetric("grossRevenue");
  return fields;
}
function getSchema(request) {
  return { schema : getFields().build()};
}
function getFormatData(requestedFields, isCheck){
  var result=[];
  if(isCheck=="metric"){
    result=(requestedFields.asArray().map(function(field){
    if(field.isMetric()){
      return field.getName(); 
    }
   })).filter(function(e){return e !==undefined});
  }
  if(isCheck=="dimension"){
    result = (requestedFields.asArray().map(function(field){
    if(field.isDimension()){
      return field.getName(); 
    }
   })).filter(function(e){return e !==undefined});
  }
  return result;  
}
function getData(request){
  var dimension =[];
  var metric =[];
  var startDate ="";
  var endDate ="";
  // Create schema for requested fields
  var requestedFields = getFields().forIds(
    request.fields.map(function(field) {
      return field.name;
    })
  );
  //var a = requestedFields.build();
  dimension = getFormatData(requestedFields,"dimension");
  metric = getFormatData(requestedFields,"metric");
  
  var getResponse = fetchDataFromAPI(request.dateRange.startDate,request.dateRange.endDate,dimension,metric);
  
  if(getResponse.length>0){
    // Transform parsed data and filter for requested fields
    var requestedData = getResponse.map(function(raw) {
      Logger.log(raw.Date);
      var values = [];
      requestedFields.asArray().map(function (field) {
        switch (field.getId()) {
          case 'Date':
            values.push(raw.Date);
            break;
          case 'ApplicationId':
            values.push(raw.ApplicationId);
            break;
          case 'ApplicationType':
            values.push(raw.ApplicationType);
            break;
          case 'AdspaceId':
            values.push(raw.AdspaceId);
            break;
          case 'CountryCode':
            values.push(raw.CountryCode);
            break;
          case 'LineItemId':
            values.push(raw.LineItemId);
            break;
          case 'LineItemType':
            values.push(raw.LineItemType);
            break;
          case 'OrderId':
            values.push(raw.OrderId);
            break;
          case 'AdvertiserId':
            values.push(raw.AdvertiserId);
            break;
          case 'CreativeId':
            values.push(raw.CreativeId);
            break;
          case 'DealId':
            values.push(raw.DealId);
            break;
          case 'DemandPartnerId':
            values.push(raw.DemandPartnerId);
            break;
          case 'incomingAdRequests':
            values.push(raw.incomingAdRequests);
            break;
          case 'servedAds':
            values.push(raw.servedAds);
            break;
          case 'impressions':
            values.push(raw.impressions);
            break;
          case 'clicks':
            values.push(raw.clicks);
            break;
          case 'CTR':
            values.push(raw.CTR);
            break;
          case 'eCPM':
            values.push(raw.eCPM);
            break;
          case 'grossRevenue':
            values.push(raw.grossRevenue);
            break;
          case 'fillrate':
            values.push(raw.fillrate);
            break;
          default:
            values.push('');
        }
      });
      return { values: values };
    });
    Logger.log(requestedData);
  }
  var c = requestedFields.build();
  return {
    schema: requestedFields.build(),
    rows: requestedData
  };
}
function fetchDataFromAPI(startDate, endDate, dimensions, metrics){

  var today = new Date();
  var oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  var timezone = Session.getTimeZone();
  
  if(startDate===""|typeof startDate==="undefined"){
    startDate = Utilities.formatDate(oneWeekAgo, timezone, 'yyyy-MM-dd');
  }
  if(endDate===""|typeof endDate==="undefined"){
   endDate = Utilities.formatDate(today, timezone, 'yyyy-MM-dd');
  }
  var url ="https://api.smaato.com/v1/reporting/";
  var service = getOAuthService();
  //Logger.log(startDate + endDate);
  var len = dimensions.length;
  var criteria = {};
  parseDimension({},dimensions,len);
  criteria=target;
  var kpis = parseMetric(metrics);
  var formData ={
  "criteria": criteria,
  "kpi": kpis,
  "period":{
    "period_type":"fixed",
    "start_date": startDate,
    "end_date": endDate
  }
  };
  var options ={
  'method' : 'POST',
  'contentType': 'application/json',
  'payload' : JSON.stringify(formData),
  'headers' : {Authorization: 'Bearer ' + service.getAccessToken()}
  };
  Logger.log(options);
  var response = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return parseReport(response); 
}
var target ={};
function parseDimension(result,dimensions,len){
	if(dimensions.length == 0 ){
		target=result;
		return ;
	}
    else if (len == dimensions.length){
		result["dimension"] = dimensions[dimensions.length - 1];
		result["child"] = null;
		dimensions.pop();
		parseDimension(result,dimensions,len);
	 }else{
		var tmp = {};
		tmp["dimension"] = dimensions[dimensions.length - 1];
		tmp["child"] = result;
		dimensions.pop();
		parseDimension(tmp,dimensions,len);
	 }
}
function parseMetric(metrics){
  var result='{';
  for (var i=0;i<metrics.length;i++){
     if(i==metrics.length-1){
      result+='"'+metrics[i]+'"'+' : true';
    }else{
      result+='"'+metrics[i]+'"'+' : true , ';
    }
  }
  result+='}';
  return JSON.parse(result);
}
function parseReport(report){
  var result =[];
  for(var i=0; i<report.length;i++){
    var kpi = report[i].kpi;
    var criteria = report[i].criteria;
    var row ={};
    for(var j=0;j<criteria.length;j++){
      var name =criteria[j].name;
      if(name=="Date"){
        row[name]=((criteria[j].value).toString()).replace(/,/g,"-");
      }else{
        row[name]=(criteria[j].value).toString();
      }
    }
    result.push(Object.assign(row, kpi));
  }
  return result; 
}