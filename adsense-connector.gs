let cc = DataStudioApp.createCommunityConnector();
let as_currency = "EUR";
let as_filters = [];
let as_limit = 100000;
let SURR_LEN = 4 // for encode UTF-16
// debug
let callId;
let DEBUG_TYPE = {
  NONE: 0,
  HEX16: 1,
  BYTE: 2,
  LONG: 3,
  FULL: 4,
}
let debugType = DEBUG_TYPE.NONE
let debugCache = !true
let ARR_LOG_START = 0

function getAuthType() {
  Logger.log(getAuthType.name);

  var cc = DataStudioApp.createCommunityConnector();
  return cc.newAuthTypeResponse().setAuthType(cc.AuthType.OAUTH2).build();
}

function getOAuthService() {
  Logger.log(getOAuthService.name);

  return OAuth2.createService("adsense")
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com')//// FIND IT IN YOUR PROJECT IN GOOGLE CLOUD
    .setClientSecret('XXXXXXXXXXXXXXXXXXXXXXX')////FIND IT IN YOUR PROJECT IN GOOGLE CLOUD
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCallbackFunction('authCallback')
    .setScope('https://www.googleapis.com/auth/adsense')
    .setParam('access_type', 'offline')
    .setParam('approval_prompt', 'force')
    .setParam('login_hint', Session.getActiveUser().getEmail());
}
/**
 * Resets the auth service.
 */
function resetAuth() {
  Logger.log(resetAuth.name);
  getOAuthService().reset();
}
function isAdminUser() {
  return true;
}
function authCallback(request) {
  Logger.log(authCallback.name);
  var authorized = getOAuthService().handleCallback(request);
  if (authorized) {
    return true;
  } else {
    return false;
  }
}
function get3PAuthorizationUrls() {
  Logger.log(get3PAuthorizationUrls.name);
  return getOAuthService().getAuthorizationUrl();
}
function isAuthValid() {
  Logger.log(isAuthValid.name);
  return getOAuthService().hasAccess();
}
function getConfig(request) {
  Logger.log(getConfig.name);
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();
  var arrOptions = [];
  var options = [];
  var countOptions = 0;
  // Get Google AdSense ID
  if (isAuthValid()) {
    //Logger.log("parsedResponse"+listAdClients());
    if (listAdClients().length > 0) {
      var parsedResponse = listAdClients();
      //Logger.log("parsedResponse"+arrOptions);
      /*for(var i=0; i < parsedResponse.length;i++){
        arrOptions.push({'label':parsedResponse[i].name, 'value':parsedResponse[i].id});
      }*/
      arrOptions = parsedResponse.map(function (parsedResponse) {
        return {
          label: parsedResponse.name,
          value: parsedResponse.name + "",
        };
      });
      //Logger.log(arrOptions);
      for (var i = 0; i < arrOptions.length; i++) {
        options.push(
          config
            .newOptionBuilder()
            .setLabel(arrOptions[i].label)
            .setValue(arrOptions[i].value)
        );
        countOptions = countOptions + 1;
      }

      switch (countOptions) {
        case 1:
          config
            .newSelectSingle()
            .setId("accountSelection")
            .setName("Select AdSense Account")
            .setHelpText("Please select an account...")
            .addOption(options[0]);
          break;
        case 2:
          config
            .newSelectSingle()
            .setId("accountSelection")
            .setName("Select AdSense Account")
            .setHelpText("Please select an account...")
            .addOption(options[0])
            .addOption(options[1]);
          break;
        case 3:
          config
            .newSelectSingle()
            .setId("accountSelection")
            .setName("Select AdSense Account")
            .setHelpText("Please select an account...")
            .addOption(options[0])
            .addOption(options[1])
            .addOption(options[2]);
          break;
        default:
          config
            .newSelectSingle()
            .setId("accountSelection")
            .setName("Select AdSense Account")
            .setHelpText("Please select an account...")
            .addOption(options[0]);
          break;
      }
      config.setDateRangeRequired(true);
      config.setIsSteppedConfig(false);
    } else {
      Logger.log("No rows returned.");
    }
  } else {
    get3PAuthorizationUrls();
  }
  //console.log("config0"+config.configParams.accountSelection);
  return config.build();
}
var adsenseSchema = [
  {
    name: "AD_FORMAT_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_FORMAT_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_PLACEMENT_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_PLACEMENT_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_UNIT_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_UNIT_ID",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_UNIT_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "BID_TYPE_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "BID_TYPE_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "BUYER_NETWORK_ID",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "COUNTRY_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "COUNTRY_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "CUSTOM_CHANNEL_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "CUSTOM_CHANNEL_ID",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "CUSTOM_CHANNEL_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "DATE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "YEAR_MONTH_DAY",
    },
  },
  {
    name: "DOMAIN_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "MONTH",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "YEAR_MONTH",
    },
  },
  {
    name: "PLATFORM_TYPE_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "PLATFORM_TYPE_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "PRODUCT_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "PRODUCT_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "REQUESTED_AD_TYPE_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "REQUESTED_AD_TYPE_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "SERVED_AD_TYPE_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "SERVED_AD_TYPE_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "TARGETING_TYPE_CODE",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "TARGETING_TYPE_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "URL_CHANNEL_ID",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "URL_CHANNEL_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "WEEK",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "YEAR_MONTH_DAY",
    },
  },
  {
    name: "BUYER_NETWORK_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
  {
    name: "AD_REQUESTS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "AD_REQUESTS_COVERAGE",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "AD_REQUESTS_CTR",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "AD_REQUESTS_RPM",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "CLICKS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "COST_PER_CLICK",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "IMPRESSIONS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "IMPRESSIONS_CTR",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "IMPRESSIONS_RPM",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "INDIVIDUAL_AD_IMPRESSIONS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "INDIVIDUAL_AD_IMPRESSIONS_CTR",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "INDIVIDUAL_AD_IMPRESSIONS_RPM",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "MATCHED_AD_REQUESTS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "MATCHED_AD_REQUESTS_CTR",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "MATCHED_AD_REQUESTS_RPM",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "PAGE_VIEWS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "PAGE_VIEWS_CTR",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "PAGE_VIEWS_RPM",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "ESTIMATED_EARNINGS",
    dataType: "NUMBER",
    semantics: {
      conceptType: "METRIC",
      semanticType: "NUMBER",
      isReaggregatable: true,
    },
    defaultAggregationType: "SUM",
  },
  {
    name: "CUSTOM_CHANNEL_NAME",
    dataType: "STRING",
    semantics: {
      conceptType: "DIMENSION",
      semanticType: "TEXT",
    },
  },
];
function getFields() {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;
  fields
    .newDimension()
    .setId("DATE")
    .setName("DATE")
    .setType(types.YEAR_MONTH_DAY);
  fields
    .newDimension()
    .setId("WEEK")
    .setName("WEEK")
    .setType(types.YEAR_MONTH_DAY);
  fields
    .newDimension()
    .setId("MONTH")
    .setName("MONTH")
    .setType(types.YEAR_MONTH);
  fields
    .newDimension()
    .setId("ACCOUNT_NAME")
    .setName("ACCOUNT_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_CLIENT_ID")
    .setName("AD_CLIENT_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("PRODUCT_NAME")
    .setName("PRODUCT_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("PRODUCT_CODE")
    .setName("PRODUCT_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_UNIT_NAME")
    .setName("AD_UNIT_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_UNIT_ID")
    .setName("AD_UNIT_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_UNIT_SIZE_NAME")
    .setName("AD_UNIT_SIZE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_UNIT_SIZE_CODE")
    .setName("AD_UNIT_SIZE_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CUSTOM_CHANNEL_NAME")
    .setName("CUSTOM_CHANNEL_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CUSTOM_CHANNEL_ID")
    .setName("CUSTOM_CHANNEL_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("OWNED_SITE_DOMAIN_NAME")
    .setName("OWNED_SITE_DOMAIN_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("OWNED_SITE_ID")
    .setName("OWNED_SITE_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("URL_CHANNEL_NAME")
    .setName("URL_CHANNEL_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("URL_CHANNEL_ID")
    .setName("URL_CHANNEL_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("BUYER_NETWORK_NAME")
    .setName("BUYER_NETWORK_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("BUYER_NETWORK_ID")
    .setName("BUYER_NETWORK_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("BID_TYPE_NAME")
    .setName("BID_TYPE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("BID_TYPE_CODE")
    .setName("BID_TYPE_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CREATIVE_SIZE_NAME")
    .setName("CREATIVE_SIZE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CREATIVE_SIZE_CODE")
    .setName("CREATIVE_SIZE_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("DOMAIN_NAME")
    .setName("DOMAIN_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("DOMAIN_CODE")
    .setName("DOMAIN_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("COUNTRY_NAME")
    .setName("COUNTRY_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("COUNTRY_CODE")
    .setName("COUNTRY_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("PLATFORM_TYPE_NAME")
    .setName("PLATFORM_TYPE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("PLATFORM_TYPE_CODE")
    .setName("PLATFORM_TYPE_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("TARGETING_TYPE_NAME")
    .setName("TARGETING_TYPE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("TARGETING_TYPE_CODE")
    .setName("TARGETING_TYPE_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CONTENT_PLATFORM_NAME")
    .setName("CONTENT_PLATFORM_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CONTENT_PLATFORM_CODE")
    .setName("CONTENT_PLATFORM_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_PLACEMENT_NAME")
    .setName("AD_PLACEMENT_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_PLACEMENT_CODE")
    .setName("AD_PLACEMENT_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("REQUESTED_AD_TYPE_NAME")
    .setName("REQUESTED_AD_TYPE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("SERVED_AD_TYPE_NAME")
    .setName("SERVED_AD_TYPE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("SERVED_AD_TYPE_CODE")
    .setName("SERVED_AD_TYPE_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_FORMAT_NAME")
    .setName("AD_FORMAT_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("AD_FORMAT_CODE")
    .setName("AD_FORMAT_CODE")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CUSTOM_SEARCH_STYLE_NAME")
    .setName("CUSTOM_SEARCH_STYLE_NAME")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("CUSTOM_SEARCH_STYLE_ID")
    .setName("CUSTOM_SEARCH_STYLE_ID")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("DOMAIN_REGISTRANT")
    .setName("DOMAIN_REGISTRANT")
    .setType(types.TEXT);
  fields
    .newDimension()
    .setId("WEBSEARCH_QUERY_STRING")
    .setName("WEBSEARCH_QUERY_STRING")
    .setType(types.TEXT);
  fields
    .newMetric()
    .setId("PAGE_VIEWS")
    .setName("PAGE_VIEWS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);
  fields
    .newMetric()
    .setId("AD_REQUESTS")
    .setName("AD_REQUESTS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);
  fields
    .newMetric()
    .setId("MATCHED_AD_REQUESTS")
    .setName("MATCHED_AD_REQUESTS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);
  fields
    .newMetric()
    .setId("TOTAL_IMPRESSIONS")
    .setName("TOTAL_IMPRESSIONS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);
  fields
    .newMetric()
    .setId("IMPRESSIONS")
    .setName("IMPRESSIONS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG);
  fields
    .newMetric()
    .setId("INDIVIDUAL_AD_IMPRESSIONS")
    .setName("INDIVIDUAL_AD_IMPRESSIONS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("CLICKS")
    .setName("CLICKS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("PAGE_VIEWS_SPAM_RATIO")
    .setName("PAGE_VIEWS_SPAM_RATIO")
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("AD_REQUESTS_SPAM_RATIO")
    .setName("AD_REQUESTS_SPAM_RATIO")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("MATCHED_AD_REQUESTS_SPAM_RATIO")
    .setName("MATCHED_AD_REQUESTS_SPAM_RATIO")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("IMPRESSIONS_SPAM_RATIO")
    .setName("IMPRESSIONS_SPAM_RATIO")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("INDIVIDUAL_AD_IMPRESSIONS_SPAM_RATIO")
    .setName("INDIVIDUAL_AD_IMPRESSIONS_SPAM_RATIO")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("CLICKS_SPAM_RATIO")
    .setName("CLICKS_SPAM_RATIO")
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("AD_REQUESTS_COVERAGE")
    .setName("AD_REQUESTS_COVERAGE")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("PAGE_VIEWS_CTR")
    .setName("PAGE_VIEWS_CTR")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("AD_REQUESTS_CTR")
    .setName("AD_REQUESTS_CTR")
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("MATCHED_AD_REQUESTS_CTR")
    .setName("MATCHED_AD_REQUESTS_CTR")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("IMPRESSIONS_CTR")
    .setName("IMPRESSIONS_CTR")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("INDIVIDUAL_AD_IMPRESSIONS_CTR")
    .setName("INDIVIDUAL_AD_IMPRESSIONS_CTR")
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("ACTIVE_VIEW_MEASURABILITY")
    .setName("ACTIVE_VIEW_MEASURABILITY")
    .setType(types.NUMBER)
    .setAggregation(aggregations.AVG)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("ACTIVE_VIEW_VIEWABILITY")
    .setName("ACTIVE_VIEW_VIEWABILITY")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("ACTIVE_VIEW_TIME")
    .setName("ACTIVE_VIEW_TIME")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("ESTIMATED_EARNINGS")
    .setName("ESTIMATED_EARNINGS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("PAGE_VIEWS_RPM")
    .setName("PAGE_VIEWS_RPM")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("AD_REQUESTS_RPM")
    .setName("AD_REQUESTS_RPM")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("MATCHED_AD_REQUESTS_RPM")
    .setName("MATCHED_AD_REQUESTS_RPM")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("IMPRESSIONS_RPM")
    .setName("IMPRESSIONS_RPM")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("INDIVIDUAL_AD_IMPRESSIONS_RPM")
    .setName("INDIVIDUAL_AD_IMPRESSIONS_RPM")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("COST_PER_CLICK")
    .setName("COST_PER_CLICK")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("TOTAL_EARNINGS")
    .setName("TOTAL_EARNINGS")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields
    .newMetric()
    .setId("WEBSEARCH_RESULT_PAGES")
    .setName("WEBSEARCH_RESULT_PAGES")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM)
    .setIsReaggregatable(true);
  fields.setDefaultDimension("DATE");
  fields.setDefaultMetric("ESTIMATED_EARNINGS");
  // console.log(getFields.name, fields.asArray())

  return fields;
}
function getFormatData(requestedFields, isCheck) {
  // Logger.log(getFormatData.name)
  var result = [];
  if (isCheck == "metric") {
    result = requestedFields
      .asArray()
      .map(function (field) {
        if (field.isMetric()) {
          return field.getId();
        }
      })
      .filter(function (e) {
        return e !== undefined;
      });
  }
  if (isCheck == "dimension") {
    result = requestedFields
      .asArray()
      .map(function (field) {
        if (field.isDimension()) {
          return field.getId();
        }
      })
      .filter(function (e) {
        return e !== undefined;
      });
  }
  return result;
}
function getSchema(request) {
  Logger.log(getSchema.name);
  //Logger.log(adsenseSchema);
  //return { schema: adsenseSchema };
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  return cc.newGetSchemaResponse().setFields(getFields()).build();
}

function getData(request) {
  let lock = LockService.getUserLock();
  lock.waitLock(1000 * 60 * 2);

  var dimension = [];
  var metric = [];
  // Create schema for requested fields
  var requestedFields = getFields().forIds(
    request.fields.map(function (field) {
      return field.name;
    })
  );
  var arrRequestedFields = requestedFields.asArray();
  dimension = getFormatData(requestedFields, "dimension");
  metric = getFormatData(requestedFields, "metric");

  let { dimensionsFilters } = request;
  if (dimensionsFilters) {
    dimensionsFilters.map((df_a) => {
      const df_1obj = df_a[0];
      const { values, operator, fieldName, type } = df_1obj;
      console.log(getData.name, "dimensionsFilters", values, operator, fieldName, type)
      let filter_s = "";
      let firstVal = values[0]
      if (type == "INCLUDE") {
        if (operator == "EQUALS") {
          filter_s = fieldName + "==" + firstVal;
          as_filters.push(filter_s);
        }
        if (operator == "REGEXP_EXACT_MATCH" && firstVal.includes("|")) {
          let tmp_a = []
          firstVal.split("|").map(val_s => {
            filter_s = fieldName + "==" + val_s;
            tmp_a.push(filter_s);
          })
          as_filters.push(tmp_a.toString());

        }

      }
    });
  }

  let { configParams } = request;
  let { as_limit: cfg_limit, as_filter_ccn: cfg_filter, as_currency: cfg_currency } = configParams;
  if (cfg_limit) {
    as_limit = cfg_limit;
  }
  if (cfg_filter) {
    cfg_filter = JSON.parse(cfg_filter);
    let filter_s;
    // console.log(getData.name, "cfg_filter", cfg_filter)
    cfg_filter.forEach((item) => {
      filter_s = "CUSTOM_CHANNEL_NAME==" + item;
      as_filters.push(filter_s);
    });
  }
  if (cfg_currency) {
    // console.log(getData.name, "cfg_currency", cfg_currency)
    as_currency = cfg_currency;
  }
  console.log(
    getData.name,
    "dimension",
    dimension,
    "metric",
    metric,
    "as_filters",
    as_filters,
    "as_limit",
    as_limit,
    "as_currency",
    as_currency,
  );

  const { dateRange } = request;
  let { startDate, endDate } = dateRange;
  let cacheString = null

  if (debugCache) {
    startDate = "2023-05-02"
    endDate = "2023-05-31"
  }
  var parsedResponse = [];

  let dateKey = startDate + "-" + endDate;
  let dimKey = dimension.sort().reduce((acc, curr) => acc + "-" + curr, "");
  let metKey = metric.sort().reduce((acc, curr) => acc + "-" + curr, "");
  let filtersKey = as_filters
    .map((str) => {
      let result = "";
      result = str.replace("CUSTOM_CHANNEL_NAME==", "CCN=");
      return result;
    })
    .reduce((acc, curr) => acc + "-" + curr, "");
  let reportKey = dateKey + filtersKey + dimKey + metKey + "-" + as_currency;



  callId = +propertyGet("as_count", 0);
  callId++;
  propertySet("as_count", callId);


  let hex16_set, hex16Small_set, hex16Small_get, hex16_get

  if (!debugCache) {
    cacheString = cacheGet(reportKey);
  } else {
    // debug set
    {
      console.log(getData.name, "callId", callId, reportKey, "new");

      parsedResponse = generateReport(
        request.configParams.accountSelection,
        startDate,
        endDate,
        dimension,
        metric
      );
      let blob = Utilities.newBlob(JSON.stringify(/* [{ abc: 12345 }] */parsedResponse));
      const blobKB = blob.getBytes().length / 1024;
      console.log(getData.name, "blobKB", blobKB);

      // Create the compressed blob.
      let gzipBlob = Utilities.gzip(blob);
      let asByte = gzipBlob.getBytes();
      const gzipBlobKB = asByte.length / 1024;
      console.log(getData.name, "gzipBlobKB", gzipBlobKB, asByte.length);
      if (debugType >= DEBUG_TYPE.BYTE) {
        arrLog(getData.name + " asByte...", asByte);
      }

      //
      let buffer, int8View, int16View;
      buffer = new ArrayBuffer(asByte.length);
      int8View = new Int8Array(buffer);
      for (let i = 0; i < int8View.length; i++) {
        int8View[i] = asByte[i];
      }

      const paddingCount = 5;
      if (asByte.length % 2 != 0) {
        buffer = new ArrayBuffer(asByte.length + paddingCount);
        int8View = new Int8Array(buffer);
        for (let i = 0; i < asByte.length; i++) {
          int8View[i] = asByte[i];
        }
        // arrLog(getData.name + " int8View[i] = asByte[i] int8View...", int8View);

        for (let i = 0; i < paddingCount; i++) {
          int8View[int8View.length - 1 - i] = paddingCount;
        }
      } else {
        buffer = new ArrayBuffer(asByte.length);
        int8View = new Int8Array(buffer);
        for (let i = 0; i < int8View.length; i++) {
          int8View[i] = asByte[i];
        }
      }

      int16View = new Int16Array(buffer);
      if (debugType >= DEBUG_TYPE.LONG) {
        console.log(getData.name, "int8View.length()", int8View.length);
      }
      let hex8 = int8ToHex8(int8View);
      hex16_set = hex8ToHex16(hex8, "0x");
      hex16Small_set = hex16ToSmall(hex16_set);
      let cacheString = String.fromCharCode(...hex16Small_set);

      if (debugType >= DEBUG_TYPE.FULL) {
        arrLog(getData.name + " int8View...", int8View);
        arrLog(getData.name + " hex8...", hex8);
      }
      if (debugType >= DEBUG_TYPE.HEX16) {
        arrLog(getData.name + " hex16...", hex16_set, ARR_LOG_START);
        arrLog(getData.name + " hex16Small...", hex16Small_set, ARR_LOG_START);
      }
      if (debugType >= DEBUG_TYPE.LONG) {
        console.log(
          getData.name,
          "int8View.length",
          int8View.length,
          "int16View.length",
          int16View.length,
          "cacheString.length",
          cacheString.length
        );
        arrLog(getData.name + " cacheString...", cacheString);
      }
      cachePut(reportKey, cacheString);
    }

    // debug get
    {
      cacheString = cacheGet(reportKey);
      console.log(
        getData.name,
        "callId",
        callId,
        reportKey,
        "found"
      );

      let buffer = new ArrayBuffer(cacheString.length * 2);
      let int8View = new Int8Array(buffer);
      let int16View = new Int16Array(buffer);
      hex16Small_get = str2Hex(cacheString, "0x");
      let hexTmp = [...hex16Small_get]
      if (debugType >= DEBUG_TYPE.LONG) {
        arrLog(getData.name + " get cacheString...", cacheString);
      }
      if (debugType >= DEBUG_TYPE.HEX16) {
        arrLog(getData.name + " get hex16Small...", hex16Small_get, ARR_LOG_START);
      }

      let hasSurr
      let nextId = SURR_LEN - 1
      // remove surr
      do {
        if (debugType >= DEBUG_TYPE.FULL) {
          console.log(getData.name + " get for lastId", nextId)
        }
        hasSurr = false
        for (let i = nextId; i < int16View.length; i++) {
          if (+hexTmp[i] + 0x3000 >= 0xD800) {
            let matchSurr_len = true
            for (let j = 1; j < SURR_LEN; j++) {
              if (+hexTmp[i] - hexTmp[i - j] != j) {
                matchSurr_len = false
                break
              }
            }
            if (matchSurr_len) {
              hasSurr = true
              if (i >= ARR_LOG_START && i < ARR_LOG_START - 20) {
                console.log(getData.name, hasSurr, "i", i)
              }
            }
          }
          if (hasSurr) {
            nextId = i + 1

            let tmp_buffer = new ArrayBuffer((int16View.length - (SURR_LEN - 1))*2);
            let tmp_int8View = new Int8Array(tmp_buffer);
            let tmp_int16View = new Int16Array(tmp_buffer);
            if (debugType >= DEBUG_TYPE.FULL) {
              // console.log(getData.name + " get add num", "0x" + (preNum + 0x3000).toString(16).padStart(4, "0"), "lastId", lastId, "preNum", preNum, "+hexA[i]", +hexTmp[i], "preNum == +hexA[i]", preNum == +hexTmp[i])
            }
            int8View = tmp_int8View
            int16View = tmp_int16View

            let num0 = +hexTmp[i]

            // mutable
            hexTmp.splice(i - (SURR_LEN - 1), SURR_LEN, "0x" + (num0 + 0x3000).toString(16).padStart(4, "0"))
            if (debugType >= DEBUG_TYPE.FULL) {
              arrLog(getData.name + " get remove surr hexTmp...", hexTmp)
            }
            break
          }
        }

        if (debugType >= DEBUG_TYPE.FULL) {
          console.log(getData.name + " get hasSurr", hasSurr)
        }
      }
      while (hasSurr)
      hex16_get = hexTmp

      if (debugType >= DEBUG_TYPE.HEX16) {
        arrLog(getData.name + " get hex16...", hex16_get, ARR_LOG_START);
      }

      // auto test
      if (debugCache) {
        let hex16Match, hex16SmallMatch, hex16_set_big_small, hex16_get_big_small
        hex16Match = isMatch(hex16_set, hex16_get, "hex16Match")
        if (!hex16Match) {
          hex16SmallMatch = isMatch(hex16Small_set, hex16Small_get, "hex16SmallMatch")
          if (hex16SmallMatch) {
            hex16_set_big_small = isMatch(hex16_set, hex16Small_set, "hex16_set_big_small")
            hex16_get_big_small = isMatch(hex16_get, hex16Small_get, "hex16_get_big_small")
          }
        }
      }
      // to num
      for (let i = 0; i < int16View.length; i++) {
        int16View[i] = +hex16_get[i];
      }
      let hex8 = int8ToHex8(int8View);
      if (debugType >= DEBUG_TYPE.LONG) {
        console.log(
          getData.name,
          "get cacheString.length",
          cacheString.length,
          "int8View.length",
          int8View.length,
          "int16View.length",
          int16View.length
        );
        arrLog(getData.name + " get int8View...", int8View);
        arrLog(getData.name + " get hex8...", hex8);
      }

      const paddingCount = 5;
      let isPadded = true;
      for (let i = 0; i < paddingCount; i++) {
        if (int8View[int8View.length - 1 - i] != paddingCount) {
          isPadded = false;
        }
      }
      if (isPadded) {
        let tmpBuff = new ArrayBuffer(int8View.length - paddingCount);
        const tmpInt8View = new Int8Array(tmpBuff);
        for (let i = 0; i < tmpInt8View.length; i++) {
          tmpInt8View[i] = int8View[i];
        }
        int8View = tmpInt8View;
        // console.log(getData.name, "tmpInt8View.length", tmpInt8View.length);
        // arrLog(getData.name + " get padd tmpInt8View...", tmpInt8View);
        // arrLog(getData.name + " get padd int8View...", int8View);
      }

      let bytes = uInt8Tobyte(int8View);
      if (debugType >= DEBUG_TYPE.BYTE) {
        arrLog(getData.name + " get bytes...", bytes);
      }
      let gzipBlob = Utilities.newBlob(bytes, "application/x-gzip");
      var ungzipBlob = Utilities.ungzip(gzipBlob);
      parsedResponse = JSON.parse(ungzipBlob.getDataAsString());

      console.log(getData.name, "rows", parsedResponse.length,);
      if (debugType >= DEBUG_TYPE.FULL) {
        console.log(getData.name, "get parsedResponse", parsedResponse);
      }
    }
  }

  console.log(getData.name, "################################################");

  if (cacheString) {
    // debug get
    {
      cacheString = cacheGet(reportKey);
      console.log(
        getData.name,
        "callId",
        callId,
        reportKey,
        "found"
      );

      let buffer = new ArrayBuffer(cacheString.length * 2);
      let int8View = new Int8Array(buffer);
      let int16View = new Int16Array(buffer);
      hex16Small_get = str2Hex(cacheString, "0x");
      let hexTmp = [...hex16Small_get]
      if (debugType >= DEBUG_TYPE.LONG) {
        arrLog(getData.name + " get cacheString...", cacheString);
      }
      if (debugType >= DEBUG_TYPE.HEX16) {
        arrLog(getData.name + " get hex16Small...", hex16Small_get, ARR_LOG_START);
      }

      let hasSurr
      let nextId = SURR_LEN - 1
      // remove surr
      do {
        if (debugType >= DEBUG_TYPE.FULL) {
          console.log(getData.name + " get for lastId", nextId)
        }
        hasSurr = false
        for (let i = nextId; i < int16View.length; i++) {
          if (+hexTmp[i] + 0x3000 >= 0xD800) {
            let matchSurr_len = true
            for (let j = 1; j < SURR_LEN; j++) {
              if (+hexTmp[i] - hexTmp[i - j] != j) {
                matchSurr_len = false
                break
              }
            }
            if (matchSurr_len) {
              hasSurr = true
              if (i >= ARR_LOG_START && i < ARR_LOG_START - 20) {
                console.log(getData.name, hasSurr, "i", i)
              }
            }
          }
          if (hasSurr) {
            nextId = i + 1

            let tmp_buffer = new ArrayBuffer((int16View.length - (SURR_LEN - 1))*2);
            let tmp_int8View = new Int8Array(tmp_buffer);
            let tmp_int16View = new Int16Array(tmp_buffer);
            if (debugType >= DEBUG_TYPE.FULL) {
              // console.log(getData.name + " get add num", "0x" + (preNum + 0x3000).toString(16).padStart(4, "0"), "lastId", lastId, "preNum", preNum, "+hexA[i]", +hexTmp[i], "preNum == +hexA[i]", preNum == +hexTmp[i])
            }
            int8View = tmp_int8View
            int16View = tmp_int16View

            let num0 = +hexTmp[i]

            // mutable
            hexTmp.splice(i - (SURR_LEN - 1), SURR_LEN, "0x" + (num0 + 0x3000).toString(16).padStart(4, "0"))
            if (debugType >= DEBUG_TYPE.FULL) {
              arrLog(getData.name + " get remove surr hexTmp...", hexTmp)
            }
            break
          }
        }

        if (debugType >= DEBUG_TYPE.FULL) {
          console.log(getData.name + " get hasSurr", hasSurr)
        }
      }
      while (hasSurr)
      hex16_get = hexTmp

      if (debugType >= DEBUG_TYPE.HEX16) {
        arrLog(getData.name + " get hex16...", hex16_get, ARR_LOG_START);
      }

      // auto test
      if (debugCache) {
        let hex16Match, hex16SmallMatch, hex16_set_big_small, hex16_get_big_small
        hex16Match = isMatch(hex16_set, hex16_get, "hex16Match")
        if (!hex16Match) {
          hex16SmallMatch = isMatch(hex16Small_set, hex16Small_get, "hex16SmallMatch")
          if (hex16SmallMatch) {
            hex16_set_big_small = isMatch(hex16_set, hex16Small_set, "hex16_set_big_small")
            hex16_get_big_small = isMatch(hex16_get, hex16Small_get, "hex16_get_big_small")
          }
        }
      }
      // to num
      for (let i = 0; i < int16View.length; i++) {
        int16View[i] = +hex16_get[i];
      }
      let hex8 = int8ToHex8(int8View);
      if (debugType >= DEBUG_TYPE.LONG) {
        console.log(
          getData.name,
          "get cacheString.length",
          cacheString.length,
          "int8View.length",
          int8View.length,
          "int16View.length",
          int16View.length
        );
        arrLog(getData.name + " get int8View...", int8View);
        arrLog(getData.name + " get hex8...", hex8);
      }

      const paddingCount = 5;
      let isPadded = true;
      for (let i = 0; i < paddingCount; i++) {
        if (int8View[int8View.length - 1 - i] != paddingCount) {
          isPadded = false;
        }
      }
      if (isPadded) {
        let tmpBuff = new ArrayBuffer(int8View.length - paddingCount);
        const tmpInt8View = new Int8Array(tmpBuff);
        for (let i = 0; i < tmpInt8View.length; i++) {
          tmpInt8View[i] = int8View[i];
        }
        int8View = tmpInt8View;
        // console.log(getData.name, "tmpInt8View.length", tmpInt8View.length);
        // arrLog(getData.name + " get padd tmpInt8View...", tmpInt8View);
        // arrLog(getData.name + " get padd int8View...", int8View);
      }

      let bytes = uInt8Tobyte(int8View);
      if (debugType >= DEBUG_TYPE.BYTE) {
        arrLog(getData.name + " get bytes...", bytes);
      }
      let gzipBlob = Utilities.newBlob(bytes, "application/x-gzip");
      var ungzipBlob = Utilities.ungzip(gzipBlob);
      parsedResponse = JSON.parse(ungzipBlob.getDataAsString());

      console.log(getData.name, "rows", parsedResponse.length,);
      if (debugType >= DEBUG_TYPE.FULL) {
        console.log(getData.name, "get parsedResponse", parsedResponse);
      }
    }
  } else {
    // debug set
    {
      console.log(getData.name, "callId", callId, reportKey, "new");

      parsedResponse = generateReport(
        request.configParams.accountSelection,
        startDate,
        endDate,
        dimension,
        metric
      );
      let blob = Utilities.newBlob(JSON.stringify(/* [{ abc: 12345 }] */parsedResponse));
      const blobKB = blob.getBytes().length / 1024;
      console.log(getData.name, "blobKB", blobKB);

      // Create the compressed blob.
      let gzipBlob = Utilities.gzip(blob);
      let asByte = gzipBlob.getBytes();
      const gzipBlobKB = asByte.length / 1024;
      console.log(getData.name, "gzipBlobKB", gzipBlobKB, asByte.length);
      if (debugType >= DEBUG_TYPE.BYTE) {
        arrLog(getData.name + " asByte...", asByte);
      }

      //
      let buffer, int8View, int16View;
      buffer = new ArrayBuffer(asByte.length);
      int8View = new Int8Array(buffer);
      for (let i = 0; i < int8View.length; i++) {
        int8View[i] = asByte[i];
      }

      const paddingCount = 5;
      if (asByte.length % 2 != 0) {
        buffer = new ArrayBuffer(asByte.length + paddingCount);
        int8View = new Int8Array(buffer);
        for (let i = 0; i < asByte.length; i++) {
          int8View[i] = asByte[i];
        }
        // arrLog(getData.name + " int8View[i] = asByte[i] int8View...", int8View);

        for (let i = 0; i < paddingCount; i++) {
          int8View[int8View.length - 1 - i] = paddingCount;
        }
      } else {
        buffer = new ArrayBuffer(asByte.length);
        int8View = new Int8Array(buffer);
        for (let i = 0; i < int8View.length; i++) {
          int8View[i] = asByte[i];
        }
      }

      int16View = new Int16Array(buffer);
      if (debugType >= DEBUG_TYPE.LONG) {
        console.log(getData.name, "int8View.length()", int8View.length);
      }
      let hex8 = int8ToHex8(int8View);
      hex16_set = hex8ToHex16(hex8, "0x");
      hex16Small_set = hex16ToSmall(hex16_set);
      let cacheString = String.fromCharCode(...hex16Small_set);

      if (debugType >= DEBUG_TYPE.FULL) {
        arrLog(getData.name + " int8View...", int8View);
        arrLog(getData.name + " hex8...", hex8);
      }
      if (debugType >= DEBUG_TYPE.HEX16) {
        arrLog(getData.name + " hex16...", hex16_set, ARR_LOG_START);
        arrLog(getData.name + " hex16Small...", hex16Small_set, ARR_LOG_START);
      }
      if (debugType >= DEBUG_TYPE.LONG) {
        console.log(
          getData.name,
          "int8View.length",
          int8View.length,
          "int16View.length",
          int16View.length,
          "cacheString.length",
          cacheString.length
        );
        arrLog(getData.name + " cacheString...", cacheString);
      }
      cachePut(reportKey, cacheString);
    }
  }
  lock.releaseLock();

  if (parsedResponse.length > 0) {
    // console.log(getData.name, "rows:", parsedResponse.length);
    // Transform parsed data and filter for requested fields
    var requestedData = parsedResponse.map(function (ads) {
      // Logger.log(ads.DATE);
      var values = [];
      arrRequestedFields.forEach(function (field) {
        var fieldID = field.getId();
        switch (fieldID) {
          case "AD_CLIENT_ID":
            values.push(ads.AD_CLIENT_ID);
            break;
          case "AD_FORMAT_CODE":
            values.push(ads.AD_FORMAT_CODE);
            break;
          case "AD_FORMAT_NAME":
            values.push(ads.AD_FORMAT_NAME);
            break;
          case "AD_PLACEMENT_CODE":
            values.push(ads.AD_PLACEMENT_CODE);
            break;
          case "AD_PLACEMENT_NAME":
            values.push(ads.AD_PLACEMENT_NAME);
            break;
          case "AD_UNIT_CODE":
            values.push(ads.AD_UNIT_CODE);
            break;
          case "AD_UNIT_ID":
            values.push(ads.AD_UNIT_ID);
            break;
          case "AD_UNIT_NAME":
            values.push(ads.AD_UNIT_NAME);
            break;
          case "AD_UNIT_SIZE_CODE":
            values.push(ads.AD_UNIT_SIZE_CODE);
            break;
          case "AD_UNIT_SIZE_NAME":
            values.push(ads.AD_UNIT_SIZE_NAME);
            break;
          case "BID_TYPE_CODE":
            values.push(ads.BID_TYPE_CODE);
            break;
          case "BID_TYPE_NAME":
            values.push(ads.BID_TYPE_NAME);
            break;
          case "BUYER_NETWORK_ID":
            values.push(ads.BUYER_NETWORK_ID);
            break;
          case "BUYER_NETWORK_NAME":
            values.push(ads.BUYER_NETWORK_NAME);
            break;
          case "COUNTRY_CODE":
            values.push(ads.COUNTRY_CODE);
            break;
          case "COUNTRY_NAME":
            values.push(ads.COUNTRY_NAME);
            break;
          case "CUSTOM_CHANNEL_CODE":
            values.push(ads.CUSTOM_CHANNEL_CODE);
            break;
          case "CUSTOM_CHANNEL_ID":
            values.push(ads.CUSTOM_CHANNEL_ID);
            break;
          case "CUSTOM_CHANNEL_NAME":
            values.push(ads.CUSTOM_CHANNEL_NAME);
            break;
          case "DATE":
            if (typeof ads.DATE !== "undefined") {
              var strDate = ads.DATE;
              var arrDate = strDate.split("-");
              var date = new Date(arrDate[0], arrDate[1] - 1, arrDate[2]);
              values.push(
                Utilities.formatDate(date, Session.getTimeZone(), "yyyyMMdd")
              );
            } else {
              values.push(ads.DATE);
            }
            //values.push(ads.DATE);
            break;
          case "DOMAIN_NAME":
            values.push(ads.DOMAIN_NAME);
            break;
          case "MONTH":
            values.push(ads.MONTH);
            break;
          case "PLATFORM_TYPE_CODE":
            values.push(ads.PLATFORM_TYPE_CODE);
            break;
          case "PLATFORM_TYPE_NAME":
            values.push(ads.PLATFORM_TYPE_NAME);
            break;
          case "PRODUCT_CODE":
            values.push(ads.PRODUCT_CODE);
            break;
          case "PRODUCT_NAME":
            values.push(ads.PRODUCT_NAME);
            break;
          case "REQUESTED_AD_TYPE_CODE":
            values.push(ads.REQUESTED_AD_TYPE_CODE);
            break;
          case "REQUESTED_AD_TYPE_NAME":
            values.push(ads.REQUESTED_AD_TYPE_NAME);
            break;
          case "SERVED_AD_TYPE_CODE":
            values.push(ads.SERVED_AD_TYPE_CODE);
            break;
          case "SERVED_AD_TYPE_NAME":
            values.push(ads.SERVED_AD_TYPE_NAME);
            break;
          case "TARGETING_TYPE_CODE":
            values.push(ads.TARGETING_TYPE_CODE);
            break;
          case "TARGETING_TYPE_NAME":
            values.push(ads.TARGETING_TYPE_NAME);
            break;
          case "URL_CHANNEL_ID":
            values.push(ads.URL_CHANNEL_ID);
            break;
          case "URL_CHANNEL_NAME":
            values.push(ads.URL_CHANNEL_NAME);
            break;
          case "WEEK":
            values.push(ads.WEEK);
            break;
          case "TOTAL_EARNINGS":
            values.push(ads.TOTAL_EARNINGS);
            break;
          case "AD_REQUESTS":
            values.push(ads.AD_REQUESTS);
            break;
          case "AD_REQUESTS_COVERAGE":
            values.push(ads.AD_REQUESTS_COVERAGE);
            break;
          case "AD_REQUESTS_CTR":
            values.push(ads.AD_REQUESTS_CTR);
            break;
          case "AD_REQUESTS_RPM":
            values.push(ads.AD_REQUESTS_RPM);
            break;
          case "CLICKS":
            values.push(ads.CLICKS);
            break;
          case "COST_PER_CLICK":
            values.push(ads.COST_PER_CLICK);
            break;
          case "IMPRESSIONS":
            values.push(ads.IMPRESSIONS);
            break;
          case "IMPRESSIONS_CTR":
            values.push(ads.IMPRESSIONS_CTR);
            break;
          case "IMPRESSIONS_RPM":
            values.push(ads.IMPRESSIONS_RPM);
            break;
          case "INDIVIDUAL_AD_IMPRESSIONS":
            values.push(ads.INDIVIDUAL_AD_IMPRESSIONS);
            break;
          case "INDIVIDUAL_AD_IMPRESSIONS_CTR":
            values.push(ads.INDIVIDUAL_AD_IMPRESSIONS_CTR);
            break;
          case "INDIVIDUAL_AD_IMPRESSIONS_RPM":
            values.push(ads.INDIVIDUAL_AD_IMPRESSIONS_RPM);
            break;
          case "MATCHED_AD_REQUESTS":
            values.push(ads.MATCHED_AD_REQUESTS);
            break;
          case "MATCHED_AD_REQUESTS_CTR":
            values.push(ads.MATCHED_AD_REQUESTS_CTR);
            break;
          case "MATCHED_AD_REQUESTS_RPM":
            values.push(ads.MATCHED_AD_REQUESTS_RPM);
            break;
          case "PAGE_VIEWS":
            values.push(ads.PAGE_VIEWS);
            break;
          case "PAGE_VIEWS_CTR":
            values.push(ads.PAGE_VIEWS_CTR);
            break;
          case "PAGE_VIEWS_RPM":
            values.push(ads.PAGE_VIEWS_RPM);
            break;
          case "ESTIMATED_EARNINGS":
            values.push(ads.ESTIMATED_EARNINGS);
            break;
          case "ACCOUNT_NAME":
            values.push(request.configParams.accountSelection);
            break;
          default:
            values.push("");
        }
      });
      return { values: values };
    });
  }
  //var c = requestedFields;
  //console.log(requestedData);
  //console.log("Return Studio Request : " + JSON.stringify({schema: requestedFields,rows: requestedData}));

  return { schema: requestedFields.build(), rows: requestedData };
}

function listAdClients() {
  Logger.log(listAdClients.name);
  // Retrieve ad client list in pages and log data as we receive it.
  var pageToken;
  var client = [];
  var adClients;
  do {
    Logger.log(AdSense.Accounts.list);
    adClients = AdSense.Accounts.list({
      pageToken: pageToken,
    });
    //Logger.log(adClients.accounts);
    if (adClients.accounts) {
      for (var i = 0; i < adClients.accounts.length; i++) {
        var adClient = adClients.accounts[i];
        Logger.log(adClient);

        client.push({ name: adClient.name, id: adClient.id });
        Logger.log(
          'Ad client for product "%s" with ID "%s" was found.',
          adClient.productCode,
          adClient.name
        );
        Logger.log(
          "Supports reporting: %s",
          adClient.supportsReporting ? "Yes" : "No"
        );
      }
    } else {
      // Logger.log('No ad clients found.');
    }
    pageToken = adClients.nextPageToken;
  } while (pageToken);
  return client;
}
function generateReport(adClientName, startDate, endDate, dimension, metric) {
  // Prepare report.
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  var today = new Date();
  var oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  var timezone = Session.getTimeZone();

  var adsenseReport = [];
  var report = AdSense.Accounts.Reports.generate(adClientName, {
    // Specify the desired ad client using a filter.
    currencyCode: as_currency,
    dimensions: dimension,
    metrics: metric,
    dateRange: "CUSTOM",
    "startDate.day": startDate.getDate(),
    "startDate.month": startDate.getMonth() + 1,
    "startDate.year": startDate.getFullYear(),
    "endDate.day": endDate.getDate(),
    "endDate.month": endDate.getMonth() + 1,
    "endDate.year": endDate.getFullYear(),
    filters: as_filters,
    limit: as_limit,
    reportingTimeZone: "ACCOUNT_TIME_ZONE",
  });

  const { rows } = report;
  if (!!rows) {
    console.log(generateReport.name, "rows:", rows.length);
    var headers = report.headers;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var cell = row.cells;
      var arrReport = {};
      var j = 0;
      headers.forEach(function (item) {
        var name = item.name;
        var valCell = cell[j];
        arrReport[name] = valCell.value;
        j++;
      });
      //console.log("AdSense Report"+arrReport);
      adsenseReport.push(arrReport);
    }
  } else {
    console.log("No rows returned.");
  }
  return adsenseReport;
}
function escapeFilterParameter(parameter) {
  return parameter.replace("\\", "\\\\").replace(",", "\\,");
}
/**
 * Logs the time taken to execute 'myFunction'.
 */
/*function measuringExecutionTime() {
  // A simple INFO log message, using sprintf() formatting.
  console.info('Timing the %s function (%d arguments)', 'getData', 1);
  // Log a JSON object at a DEBUG level. The log is labeled
  // with the message string in the log viewer, and the JSON content
  // is displayed in the expanded log structure under "structPayload".
  var parameters = {
      isValid: true,
      content: 'some string',
      timestamp: new Date()
  };
  //console.log({message: 'Function Input', initialData: parameters});
  var label = 'getData() time'; // Labels the timing log entry.
  console.time(label); // Starts the timer.
  try {
    myFunction(parameters); // Function to time.
  } catch (e) {
    // Logs an ERROR message.
    console.error('getData() yielded an error: ' + e);
  }
  console.timeEnd(label); // Stops the timer, logs execution duration.
}*/
function dateToJson(paramName, value) {
  var year = paramName + ".year";
  var month = paramName + ".month";
  var day = paramName + ".day";
  return {
    year: value.getFullYear(),
    month: value.getMonth() - 1,
    day: value.getDate(),
  };
}
function bufferToHex(buffer) {
  return [...new Int8Array(buffer)]
    .map((b) => {
      if (b < 0) b += 256;
      return b.toString(16).padStart(2, "0");
    })
    .join("");
}
int8ToHex8 = (arr, pre = "") => {
  return [...arr].map((b) => {
    if (b < 0) {
      let tmp = b;
      b += 256;
      // console.log(int8ToHex8.name, b, "to", tmp)
      // console.log(int8ToHex8.name, b.toString(16).padStart(2, "0"), "to", tmp.toString(16).padStart(2, "0"))
    }
    return pre + b.toString(16).padStart(2, "0");
  });
};
uInt8Tobyte = (uint8) => {
  return [...uint8].map((b) => {
    if (b > 127) b -= 256;
    return b;
  });
};

/* It is in the range 0xD800–0xDBFF
It is in the range 0xDC00–0xDFFF */
hex8ToHex16 = (arr, pre = "") => {
  let len = arr.length;
  let result = [];
  for (let i = 0; i < len / 2; i++) {
    let tmp = "";
    tmp = pre + arr[i * 2 + 1] + arr[i * 2];
    result.push(tmp);
  }
  return result;
};
hex16ToSmall = (arr) => {
  let len = arr.length;
  let result = [...arr];
  // console.log("result 1", result)

  let id_offset = 0;
  for (let i = 0; i < len; i++) {
    let tmpN = +arr[i];
    if (tmpN >= 0xd800) {
      // console.log("tmpN", tmpN, 0xD800, tmpN > 0xD800, "i", i, "id_offset", id_offset)
      tmpN -= 0x3000;
      let tmpS0 = "0x" + tmpN.toString(16).padStart(4, "0");
      tmpN -= 1;
      let tmpS1 = "0x" + tmpN.toString(16).padStart(4, "0");
      tmpN -= 1;
      let tmpS2 = "0x" + tmpN.toString(16).padStart(4, "0");
      tmpN -= 1;
      let tmpS3 = "0x" + tmpN.toString(16).padStart(4, "0");
      result.splice(i + id_offset, 1, tmpS3, tmpS2, tmpS1, tmpS0);
      // console.log("result", result)
      id_offset += SURR_LEN - 1;
    }
  }
  return result;
};
str2Hex = function (str, pre = "") {
  var hex, i;

  var result = [];
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result.push(pre + ("000" + hex).slice(-4));
  }

  return result;
};
arrLog = (pre = "", arr, start = 0, max = 12) => {
  // console.log(pre, "origin", arr);
  max = 20
  let tmp = [
    ...[...arr].slice(start, start + max),
    // "...",
    // ...[...arr].slice(arr.length - max, arr.length),
  ];
  console.log(pre, tmp);
};

let isMatch = (arr1, arr2, name, isLog = true) => {
  let failCount = 0
  let failID = 0
  let match = true
  arr1.map((val, id) => {
    if (failCount > 10) return

    if (val != arr2[id]) {
      match = false
      failCount++
      failID = id

      if (isLog) {
        console.log(name, "not match", failID, val, arr2[id])
      }
    }
  })
  console.log(name, match, "arr1.length", arr1.length, "arr2.length", arr2.length)
  return match
}
let log2Arr = (arr1, arr2) => {
  arr1.map((val, id) => {
    console.log(log2Arr.name, id, val, arr2[id])
  })
  console.log("arr1.length", arr1.length, "arr2.length", arr2.length)
}
