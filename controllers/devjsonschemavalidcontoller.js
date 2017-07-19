'use strict'; 
const raven = require('raven');
var firebase = require("firebase");
var Validator = require('jsonschema').Validator;
var v = new Validator();

//var Promise = require('promise');
var winston = require('winston');
var Sentry = require('winston-sentry');
winston.emitErrs = true;

var couchbase = require('couchbase');
//Sentry links
var devDsn   = "http://80504eac17364f74b8f10ca8214c63b7:7d67fc15515641fca73ddc28d8729f56@13.126.143.85:8080/5";
var stageDsn = "http://ead9f90b28014e9f8b6c88d0f4d87585:16ec535842814dd6833e4fed3fb0887f@13.126.143.85:8080/4";
var prodDsn  = "http://5a0ac8a56dbd402584faaa394c07c4fc:b313263da3a44d0298fe785abca5e0c8@13.126.143.85:8080/3";
    
var dsn = devDsn;

//archive databse links
var deArchibDatabaseRef    = 'couchbase://ec2-13-126-22-175.ap-south-1.compute.amazonaws.com:8091';
var stageArchibDatabaseRef = 'couchbase://ec2-13-126-36-224.ap-south-1.compute.amazonaws.com:8091';
var prodArchibDatabaseRef  = 'couchbase://ec2-35-154-219-169.ap-south-1.compute.amazonaws.com:8091';

var archiveDatabaselink = deArchibDatabaseRef;

//databse connection created For ArchiveDatabase
var archiveCluster = new couchbase.Cluster(archiveDatabaselink);
var archiveBucket = archiveCluster.openBucket('pb_rev_store');

var DevappDatabaseRef   = 'couchbase://dev.dirolabs.com:8091';
var StageappDatabaseRef = 'couchbase://stage.dirolabs.com:8091';
var ProdappDatabaseRef  = 'couchbase://prod.dirolabs.com:8091';

var mainDatabaseLink = DevappDatabaseRef;

var shadowCluster = new couchbase.Cluster(mainDatabaseLink);
var shadowBucket = shadowCluster.openBucket('phonebooks_shadow','qwaszxQWASZX1234');


//Push for android
var pathToFcm      = 'https://fcm.googleapis.com/fcm/send';
var devServerKey   = 'AAAAzbhFRk4:APA91bG8WyAPK1dW5kUpLMuvB3WLiwg0WuF1kZWiJu3OCIoWpliA1FYOrv60ZxeHSfhqoQmXHqsvl6n1YU5GeKvYhh7rwURw0nfWiSHqjCfN5ZAW6EnpD_GD_GGT-rW9bcsgndSlubairJuQd3cI44S6nKCMkkkAvg';
var stageServerKey = 'AAAAzbhFRk4:APA91bG8WyAPK1dW5kUpLMuvB3WLiwg0WuF1kZWiJu3OCIoWpliA1FYOrv60ZxeHSfhqoQmXHqsvl6n1YU5GeKvYhh7rwURw0nfWiSHqjCfN5ZAW6EnpD_GD_GGT-rW9bcsgndSlubairJuQd3cI44S6nKCMkkkAvg';
var prodServerKey  = 'AAAAi-6DS4E:APA91bHDmfLOZar-GYzh5AHVFXshl0ZZ58TCvIlxSSuuS8WkWiWC5gplkTAtYd6U9s08y2x6xm3hnxyXHMdU9u3WMsgFkgaBLgq6x0YQDtuyr6brdp55wVqqJzbqJ0BlP93TuSbcIETZuuoEQHztDO0MnNkFwdygZw';

//Push for iOS
var Push = require('node_apns').Push;
var push = Push({
//    cert: require('fs').readFileSync('./conf/stageiOS.pem'), 
//    key: require('fs').readFileSync('./conf/stageiOS.pem')
    cert: require('fs').readFileSync('./conf/pushcert.pem'), 
    key: require('fs').readFileSync('./conf/pushcert.pem')
});

//var config = {
//  apiKey: 'AAAAzbhFRk4:APA91bG8WyAPK1dW5kUpLMuvB3WLiwg0WuF1kZWiJu3OCIoWpliA1FYOrv60ZxeHSfhqoQmXHqsvl6n1YU5GeKvYhh7rwURw0nfWiSHqjCfN5ZAW6EnpD_GD_GGT-rW9bcsgndSlubairJuQd3cI44S6nKCMkkkAvg',
////  authDomain: "<PROJECT_ID>.firebaseapp.com",
////  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
////  storageBucket: "<BUCKET>.appspot.com",
//};
//firebase.initializeApp(config);




// /* 
//   Now you may send notifications!
// */
// 
//var uidd = "17af1da437438c1570278e7f902a8a0e082669e8e4a164379af308a3e2508eb1";
//var uidd = "AE909E19104C0C7DB5E7A8EF195C6C6A85A2AB21AEACA4D5DD0D36BEF88EE701";
//var uid = uidd.toLowerCase();
//push.on('sent', function (notification) {
// 
//    // The notification has been sent to the socket (it may be buffered if the network is slow...) 
//    console.log('Sent', notification);
// 
//});
// 
//push.on('notificationError', function (errorCode, uid) {
// 
//    // Apple has returned an error: 
//    console.log('Notification with uid', uid, 'triggered an error:', require('node_apns').APNS.errors[errorCode]);
// 
//});
// 
//push.on('error', function (error) { 
//    console.log('Yipikaye!', error); 
//});


//
//var feedback = require('node_apns').Feedback({cert:require('fs').readFileSync('./conf/pushcert.pem'), key:require('fs').readFileSync('./conf/pushcert.pem')});
// 
//feedback.on('device', function (time, uid) {
//    console.log('Token', uid, 'did not respond to notification on', new Date(time * 1000));
//});
// 
//feedback.on('end', function () {
//    console.log('Done');
//});


// var Notification = require('node_apns').Notification,	
//                                n = Notification(uid, {aps:{"alert":"hello", "sound":"default"}});

//                                    push.on('notificationError', function (errorCode, uid) {
// 
//    // Apple has returned an error: 
//    console.log('Notification with uid', uid, 'triggered an error:', require('node_apns').APNS.errors[errorCode]);
// 
//});

//
//                                if (n.isValid()) {
//                                    push.sendNotification(n);
//                                    
//
//                                    
//                                    console.log(n);
//                                    console.log("hello");
//                                }
//                                else{
//                                    console.log("ggg");
//                                }
// console.log(n);

//expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.


//push ios new test
var APNS = {
    /*
        SOURCE: http://developer.apple.com/library/ios/#DOCUMENTATION/NetworkingInternet/Conceptual/RemoteNotificationsPG/CommunicatingWIthAPS/CommunicatingWIthAPS.html
    */
 
    development: {
        host: 'gateway.sandbox.push.apple.com',
        port: 2195
    },
    production: {
        host: 'gateway.push.apple.com',
        port: 2195
    },
    feedback: {
        port: 2196,
        tupleSize: 38 /* The feedback binary tuple's size in Bytes (4 + 2 + 32) */
    },
    errors : {
        '0': 'No errors encountered',
        '1': 'Processing error',
        '2': 'Missing device token',
        '3': 'Missing topic',
        '4': 'Missing payload',
        '5': 'Invalid token size',
        '6': 'Invalid topic size',
        '7': 'Invalid payload size',
        '8': 'Invalid token',
        '255': 'None (unknown)'
    }		
};

var push = Push({cert:require('fs').readFileSync('./conf/pushcert.pem'), key:require('fs').readFileSync('./conf/pushcert.pem')}, {
    host: require('node_apns').APNS.development.host
});

//var Notification = require('node_apns').Notification,	
//                                n = Notification(uid, {aps:{"alert":"hello", "sound":"default"}});
//                                if (n.isValid()) {
//                                    push.sendNotification(n);
//                                    console.log(n);
//                                    console.log("hello");
//                                }
//                                else{
//                                    console.log("ggg");
//                                }





var request = require('request');

function sendMessageToUser(deviceId, message) {
  request({
    url: pathToFcm,
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+devServerKey
    },
    body: JSON.stringify(
      { "data": {
        "title" : 'Diro Invalid Doc',
        "message": message
      },
      "notification" : {
        "title" : 'Diro Invalid Doc',
        "body" : message
      },
      "to" : deviceId
      }
    )
  }, function(error, response, body) {
    if (error) { 
      console.error(error, response, body); 
    }
    else if (response.statusCode >= 400) { 
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
    }
    else {
      console.log('Done!')
    }
  });
};
  
//sendMessageToUser(
//  "dqYMADZvhgw:APA91bFLLKmzvEcC_x4vttZc8XBSi4Tda93LFxccYBf2nRykpMw1EB2--lxMtig2X3f4QKtCu7clIu_4GEWo7sPLaxHuefRAQ6dPQ_S7qVT91GRsjePj3DefmoMZaNvyBwM7pL0ap8U8",
//  { message: 'Hello puf'}
//);


//var mxDetails = function(documentId, callback) {
// 
//    shadowBucket.get(mxid, function(error, result) {
//        if(error) {
//            return callback(error, null);
//        }
//        callback(null, result.value.dv);
//    });
//};
//
//
//function getDocFromShadow(mxid ,fn){
//        if(mxid){ 
//        shadowBucket.get(mxid, function(err, result) {
//          if (err) {
//            if (err.code == couchbase.errors.keyNotFound) {
//                console.log('Key does not exist');
//            } else {
//                console.log('Some other error occurred: %j', err);
//            }
//            } else {
////                console.log('Retrieved document with value: %j', result.value);
////                console.log('CAS is %j', result.cas);
//                var dv = result.value.dv;
//                fn(dv);
//            }
//        });
//        }
//    };
//    
//// function  foo(address, fn){
////  geocoder.geocode( { 'address': address}, function(results, status) {
////     fn(results[0].geometry.location); 
////  });
////};
//
//getDocFromShadow('919368536885', function(location){
////  alert(location); // this is where you get the return value
//  return location
//});
    

class JsonSchemaValidator {

  constructor() {
    // this.height = height;
    // this.width = width;
  }
  
  
//  getSubDocumentShadow(mxid){
//       shadowBucket.lookupIn(mxid).get("defaultdx").execute((error, result) => {
//        if(error) {
//            throw error;
//        }
//        var rr = result;
//        console.log(rr);
//        var dv = result.value;
//        console.log('hello');
//        console.log(dv);
////        var deviceToken = dv[0]['deviceToken'];
//    });
//  }
  
 
  
 
    
    
    


    docReplicate(reqData){
//        console.log('docReplicte');
//         console.log(dsn);
         var docId    =  reqData._id;
         var docRevId =  reqData._rev;
        
        if(docId){ 
        var newDocId = docId +'-'+ docRevId;
//        console.log(newDocId);
        archiveBucket.upsert(newDocId, reqData,function(error, result) {
        if(error) {
             
              var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { errorCode: 'ArchiveFail',newdocid:newDocId}
                            })
                    ]
                });
                logger.error('ArchiveFail '+error);
             
         }
         console.log(result);
         });
        }
    }

    cxdxSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cxdx",
            "properties": {
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "ax": {
                    "id": "/properties/ax",
                    "type": "string",
                    "minLength": 1
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "cxname": {
                    "id": "/properties/cxname",
                    "type": "string"
                },
                "cxnumber": {
                    "id": "/properties/cxnumber",
                    "type": "string",
                    "minLength": 1
                },
                "dxnumber": {
                    "id": "/properties/dxnumber",
                    "type": "string",
                    "minLength": 1
                },
                "dxtype": {
                    "id": "/properties/dxtype",
                    "type": "string"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "isinvited": {
                    "id": "/properties/isinvited",
                    "items": {
                        "id": "/properties/isinvited/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "mx": {
                    "id": "/properties/mx",
                    "items": {
                        "id": "/properties/mx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 1
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "required": ["cxnumber", "dxnumber", "owner", "type", "ax"]
        };
        var valRes = v.validate(jsonData, Schema);
        //console.log(valRes);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;

    }
    ;
    cxpSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cxp",
            "properties": {
                "352356072906050": {
                    "id": "/properties/352356072906050",
                    "properties": {
                        "contactid": {
                            "id": "/properties/352356072906050/properties/contactid",
                            "type": "string"
                        },
                        "cxp_lookup_key": {
                            "id": "/properties/352356072906050/properties/cxp_lookup_key",
                            "type": "string"
                        },
                        "fcalls": {
                            "id": "/properties/352356072906050/properties/fcalls",
                            "type": "string"
                        },
                        "fviews": {
                            "id": "/properties/352356072906050/properties/fviews",
                            "type": "string"
                        }
                    },
                    "type": "object"
                },
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "cxid": {
                    "id": "/properties/cxid",
                    "type": "string",
                    "minLength": 1
                },
                "displayname": {
                    "id": "/properties/displayname",
                    "type": "string"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "events": {
                    "id": "/properties/events",
                    "items": {},
                    "type": "array"
                },
                "firstname": {
                    "id": "/properties/firstname",
                    "type": "string"
                },
                "lastmet": {
                    "id": "/properties/lastmet",
                    "properties": {
                        "location": {
                            "id": "/properties/lastmet/properties/location",
                            "type": "string"
                        },
                        "time": {
                            "id": "/properties/lastmet/properties/time",
                            "type": "string"
                        }
                    },
                    "type": "object"
                },
                "lastname": {
                    "id": "/properties/lastname",
                    "type": "string"
                },
                "lastused": {
                    "id": "/properties/lastused",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 4
                },
                "privacy": {
                    "id": "/properties/privacy",
                    "items": {},
                    "type": "array"
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "required": ["type", "cxid"]
        };
        var valRes = v.validate(jsonData, Schema);
        //console.log(valRes);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }
    ;
    dxSchemaValidate(jsonData) {
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "http://example.com/example.json",
            "properties": {
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "backgroundcolor": {
                    "id": "/properties/backgroundcolor",
                    "type": "string"
                },
                "creatorname": {
                    "id": "/properties/creatorname",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "dxname": {
                    "id": "/properties/dxname",
                    "type": "string"
                },
                "dxtype": {
                    "id": "/properties/dxtype",
                    "type": "string"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "nickname": {
                    "id": "/properties/nickname",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string"
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "process1496389865513": {
                    "id": "/properties/process1496389865513",
                    "items": {
                        "id": "/properties/process1496389865513/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process1496389865513/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process1496389865513/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process1496389865513/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process1496389865513/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process1496389865513/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process1496389865513/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process1496389865513/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process1496389865513/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string"
                }
            },
            "type": "object"
        };
        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return false;
    }
    ;
    cxWithDxSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cx",
            "properties": {
                "address": {
                    "id": "/properties/address",
                    "items": {
                        "id": "/properties/address/items",
                        "properties": {
                            "work": {
                                "id": "/properties/address/items/properties/work",
                                "properties": {
                                    "addressformat": {
                                        "id": "/properties/address/items/properties/work/properties/addressformat",
                                        "type": "string"
                                    },
                                    "city": {
                                        "id": "/properties/address/items/properties/work/properties/city",
                                        "type": "string"
                                    },
                                    "country": {
                                        "id": "/properties/address/items/properties/work/properties/country",
                                        "type": "string"
                                    },
                                    "countrycode": {
                                        "id": "/properties/address/items/properties/work/properties/countrycode",
                                        "type": "string"
                                    },
                                    "state": {
                                        "id": "/properties/address/items/properties/work/properties/state",
                                        "type": "string"
                                    },
                                    "street": {
                                        "id": "/properties/address/items/properties/work/properties/street",
                                        "type": "string"
                                    },
                                    "zip": {
                                        "id": "/properties/address/items/properties/work/properties/zip",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "admindx": {
                    "id": "/properties/admindx",
                    "items": {
                        "id": "/properties/admindx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "dx": {
                    "minProperties": 1,
                    "id": "/properties/dx",
                    "items": {
                        "id": "/properties/dx/items",
                        "type": "string",
                        "minLength": 2
                    },
                    "type": "array"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "cxone": {
                    "id": "/properties/cxone",
                    "properties": {
                        "_id": {
                            "id": "/properties/cxone/properties/_id",
                            "type": "string"
                        },
                        "displayname": {
                            "id": "/properties/cxone/properties/displayname",
                            "type": "string"
                        },
                        "email": {
                            "id": "/properties/cxone/properties/email",
                            "items": {
                                "id": "/properties/cxone/properties/email/items",
                                "properties": {
                                    "work ✓": {
                                        "id": "/properties/cxone/properties/email/items/properties/work ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "firstname": {
                            "id": "/properties/cxone/properties/firstname",
                            "type": "string"
                        },
                        "image": {
                            "id": "/properties/cxone/properties/image",
                            "items": {
                                "id": "/properties/cxone/properties/image/items",
                                "properties": {
                                    "active": {
                                        "id": "/properties/cxone/properties/image/items/properties/active",
                                        "type": "string"
                                    },
                                    "bytesize": {
                                        "id": "/properties/cxone/properties/image/items/properties/bytesize",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "lastname": {
                            "id": "/properties/cxone/properties/lastname",
                            "type": "string"
                        },
                        "middlename": {
                            "id": "/properties/cxone/properties/middlename",
                            "type": "string"
                        },
                        "org": {
                            "id": "/properties/cxone/properties/org",
                            "items": {
                                "id": "/properties/cxone/properties/org/items",
                                "properties": {
                                    "current": {
                                        "id": "/properties/cxone/properties/org/items/properties/current",
                                        "properties": {
                                            "org_dept": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_dept",
                                                "type": "string"
                                            },
                                            "org_eptime": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_eptime",
                                                "type": "string"
                                            },
                                            "org_name": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_name",
                                                "type": "string"
                                            },
                                            "org_title": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_title",
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "phone": {
                            "id": "/properties/cxone/properties/phone",
                            "items": {
                                "id": "/properties/cxone/properties/phone/items",
                                "properties": {
                                    "main ✓": {
                                        "id": "/properties/cxone/properties/phone/items/properties/main ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "profilecx": {
                            "id": "/properties/cxone/properties/profilecx",
                            "type": "string"
                        },
                        "social": {
                            "id": "/properties/cxone/properties/social",
                            "items": {
                                "id": "/properties/cxone/properties/social/items",
                                "properties": {
                                    "linkedin ✓": {
                                        "id": "/properties/cxone/properties/social/items/properties/linkedin ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "website": {
                            "id": "/properties/cxone/properties/website",
                            "items": {
                                "id": "/properties/cxone/properties/website/items",
                                "properties": {
                                    "homepage ✓": {
                                        "id": "/properties/cxone/properties/website/items/properties/homepage ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        }
                    },
                    "type": "object"
                },
                "displayname": {
                    "id": "/properties/displayname",
                    "type": "string",
                    "minLength": 1
                },
                "email": {
                    "id": "/properties/email",
                    "items": {
                        "id": "/properties/email/items",
                        "properties": {
                            "work": {
                                "id": "/properties/email/items/properties/work",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "events": {
                    "id": "/properties/events",
                    "items": {
                        "id": "/properties/events/items",
                        "properties": {
                            "Birthday": {
                                "id": "/properties/events/items/properties/Birthday",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "firstname": {
                    "id": "/properties/firstname",
                    "type": "string"
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "lastname": {
                    "id": "/properties/lastname",
                    "type": "string"
                },
                "mx": {
                    "id": "/properties/mx",
                    "items": {
                        "id": "/properties/mx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "org": {
                    "id": "/properties/org",
                    "items": {
                        "id": "/properties/org/items",
                        "properties": {
                            "current": {
                                "id": "/properties/org/items/properties/current",
                                "properties": {
                                    "org_dept": {
                                        "id": "/properties/org/items/properties/current/properties/org_dept",
                                        "type": "string"
                                    },
                                    "org_name": {
                                        "id": "/properties/org/items/properties/current/properties/org_name",
                                        "type": "string"
                                    },
                                    "org_title": {
                                        "id": "/properties/org/items/properties/current/properties/org_title",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 1
                },
                "phone": {
                    "id": "/properties/phone",
                    "items": {
                        "id": "/properties/phone/items",
                        "properties": {
                            "phone": {
                                "id": "/properties/phone/items/properties/phone",
                                "type": "string",
                                "minLength": 1
                            }
                        },
                        "type": "object",
                        "minProperties": 1
                    },
                    "type": "array",
                    "minItems": 1
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modNo": {
                                "id": "/properties/process/items/properties/modNo",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "profilecx": {
                    "id": "/properties/profilecx",
                    "type": "string"
                },
                "relation": {
                    "id": "/properties/relation",
                    "items": {
                        "id": "/properties/relation/items",
                        "properties": {
                            "Assistant": {
                                "id": "/properties/relation/items/properties/Assistant",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "sharedx": {
                    "id": "/properties/sharedx",
                    "items": {
                        "id": "/properties/sharedx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "social": {
                    "id": "/properties/social",
                    "items": {
                        "id": "/properties/social/items",
                        "properties": {
                            "LinkedIn": {
                                "id": "/properties/social/items/properties/LinkedIn",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "required": ["displayname", "phone", "owner", "type", "dx"]
        };
        var valRes = v.validate(jsonData, Schema);
        //console.log(valRes);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }
    cxWithSharedxSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cx",
            "properties": {
                "address": {
                    "id": "/properties/address",
                    "items": {
                        "id": "/properties/address/items",
                        "properties": {
                            "work": {
                                "id": "/properties/address/items/properties/work",
                                "properties": {
                                    "addressformat": {
                                        "id": "/properties/address/items/properties/work/properties/addressformat",
                                        "type": "string"
                                    },
                                    "city": {
                                        "id": "/properties/address/items/properties/work/properties/city",
                                        "type": "string"
                                    },
                                    "country": {
                                        "id": "/properties/address/items/properties/work/properties/country",
                                        "type": "string"
                                    },
                                    "countrycode": {
                                        "id": "/properties/address/items/properties/work/properties/countrycode",
                                        "type": "string"
                                    },
                                    "state": {
                                        "id": "/properties/address/items/properties/work/properties/state",
                                        "type": "string"
                                    },
                                    "street": {
                                        "id": "/properties/address/items/properties/work/properties/street",
                                        "type": "string"
                                    },
                                    "zip": {
                                        "id": "/properties/address/items/properties/work/properties/zip",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "displayname": {
                    "id": "/properties/displayname",
                    "type": "string",
                    "minLength": 1
                },
                "email": {
                    "id": "/properties/email",
                    "items": {
                        "id": "/properties/email/items",
                        "properties": {
                            "work": {
                                "id": "/properties/email/items/properties/work",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "events": {
                    "id": "/properties/events",
                    "items": {
                        "id": "/properties/events/items",
                        "properties": {
                            "Birthday": {
                                "id": "/properties/events/items/properties/Birthday",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "firstname": {
                    "id": "/properties/firstname",
                    "type": "string"
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "lastname": {
                    "id": "/properties/lastname",
                    "type": "string"
                },
                "mx": {
                    "id": "/properties/mx",
                    "items": {
                        "id": "/properties/mx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "org": {
                    "id": "/properties/org",
                    "items": {
                        "id": "/properties/org/items",
                        "properties": {
                            "current": {
                                "id": "/properties/org/items/properties/current",
                                "properties": {
                                    "org_dept": {
                                        "id": "/properties/org/items/properties/current/properties/org_dept",
                                        "type": "string"
                                    },
                                    "org_name": {
                                        "id": "/properties/org/items/properties/current/properties/org_name",
                                        "type": "string"
                                    },
                                    "org_title": {
                                        "id": "/properties/org/items/properties/current/properties/org_title",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 1
                },
                "phone": {
                    "id": "/properties/phone",
                    "items": {
                        "id": "/properties/phone/items",
                        "properties": {
                            "phone": {
                                "id": "/properties/phone/items/properties/phone",
                                "type": "string",
                                "minLength": 1
                            }
                        },
                        "type": "object",
                        "minProperties": 1
                    },
                    "type": "array",
                    "minItems": 1
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modNo": {
                                "id": "/properties/process/items/properties/modNo",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "profilecx": {
                    "id": "/properties/profilecx",
                    "type": "string"
                },
                "relation": {
                    "id": "/properties/relation",
                    "items": {
                        "id": "/properties/relation/items",
                        "properties": {
                            "Assistant": {
                                "id": "/properties/relation/items/properties/Assistant",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "sharedx": {
                    "id": "/properties/sharedx",
                    "items": {
                        "id": "/properties/sharedx/items",
                        "type": "string",
                        "minLength":1,
                    },
                    "type": "array",
                    "minItems":1
                },
                "social": {
                    "id": "/properties/social",
                    "items": {
                        "id": "/properties/social/items",
                        "properties": {
                            "LinkedIn": {
                                "id": "/properties/social/items/properties/LinkedIn",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "required": ["displayname", "phone", "owner", "type", "sharedx"]
        };
        var valRes = v.validate(jsonData, Schema);
        //console.log(valRes);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }
    ;
    cxWithArchivedxSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cx",
            "properties": {
                "address": {
                    "id": "/properties/address",
                    "items": {
                        "id": "/properties/address/items",
                        "properties": {
                            "work": {
                                "id": "/properties/address/items/properties/work",
                                "properties": {
                                    "addressformat": {
                                        "id": "/properties/address/items/properties/work/properties/addressformat",
                                        "type": "string"
                                    },
                                    "city": {
                                        "id": "/properties/address/items/properties/work/properties/city",
                                        "type": "string"
                                    },
                                    "country": {
                                        "id": "/properties/address/items/properties/work/properties/country",
                                        "type": "string"
                                    },
                                    "countrycode": {
                                        "id": "/properties/address/items/properties/work/properties/countrycode",
                                        "type": "string"
                                    },
                                    "state": {
                                        "id": "/properties/address/items/properties/work/properties/state",
                                        "type": "string"
                                    },
                                    "street": {
                                        "id": "/properties/address/items/properties/work/properties/street",
                                        "type": "string"
                                    },
                                    "zip": {
                                        "id": "/properties/address/items/properties/work/properties/zip",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "admindx": {
                    "id": "/properties/admindx",
                    "items": {
                        "id": "/properties/admindx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "archivedx": {
                    "minProperties": 1,
                    "id": "/properties/archivedx",
                    "items": {
                        "id": "/properties/archivedx/items",
                        "type": "string",
                        "minLength": 2
                    },
                    "type": "array"
                },
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "cxone": {
                    "id": "/properties/cxone",
                    "properties": {
                        "_id": {
                            "id": "/properties/cxone/properties/_id",
                            "type": "string"
                        },
                        "displayname": {
                            "id": "/properties/cxone/properties/displayname",
                            "type": "string"
                        },
                        "email": {
                            "id": "/properties/cxone/properties/email",
                            "items": {
                                "id": "/properties/cxone/properties/email/items",
                                "properties": {
                                    "work ✓": {
                                        "id": "/properties/cxone/properties/email/items/properties/work ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "firstname": {
                            "id": "/properties/cxone/properties/firstname",
                            "type": "string"
                        },
                        "image": {
                            "id": "/properties/cxone/properties/image",
                            "items": {
                                "id": "/properties/cxone/properties/image/items",
                                "properties": {
                                    "active": {
                                        "id": "/properties/cxone/properties/image/items/properties/active",
                                        "type": "string"
                                    },
                                    "bytesize": {
                                        "id": "/properties/cxone/properties/image/items/properties/bytesize",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "lastname": {
                            "id": "/properties/cxone/properties/lastname",
                            "type": "string"
                        },
                        "middlename": {
                            "id": "/properties/cxone/properties/middlename",
                            "type": "string"
                        },
                        "org": {
                            "id": "/properties/cxone/properties/org",
                            "items": {
                                "id": "/properties/cxone/properties/org/items",
                                "properties": {
                                    "current": {
                                        "id": "/properties/cxone/properties/org/items/properties/current",
                                        "properties": {
                                            "org_dept": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_dept",
                                                "type": "string"
                                            },
                                            "org_eptime": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_eptime",
                                                "type": "string"
                                            },
                                            "org_name": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_name",
                                                "type": "string"
                                            },
                                            "org_title": {
                                                "id": "/properties/cxone/properties/org/items/properties/current/properties/org_title",
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "phone": {
                            "id": "/properties/cxone/properties/phone",
                            "items": {
                                "id": "/properties/cxone/properties/phone/items",
                                "properties": {
                                    "main ✓": {
                                        "id": "/properties/cxone/properties/phone/items/properties/main ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "profilecx": {
                            "id": "/properties/cxone/properties/profilecx",
                            "type": "string"
                        },
                        "social": {
                            "id": "/properties/cxone/properties/social",
                            "items": {
                                "id": "/properties/cxone/properties/social/items",
                                "properties": {
                                    "linkedin ✓": {
                                        "id": "/properties/cxone/properties/social/items/properties/linkedin ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        },
                        "website": {
                            "id": "/properties/cxone/properties/website",
                            "items": {
                                "id": "/properties/cxone/properties/website/items",
                                "properties": {
                                    "homepage ✓": {
                                        "id": "/properties/cxone/properties/website/items/properties/homepage ✓",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": "array"
                        }
                    },
                    "type": "object"
                },
                "displayname": {
                    "id": "/properties/displayname",
                    "type": "string",
                    "minLength": 1
                },
                "email": {
                    "id": "/properties/email",
                    "items": {
                        "id": "/properties/email/items",
                        "properties": {
                            "work": {
                                "id": "/properties/email/items/properties/work",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "events": {
                    "id": "/properties/events",
                    "items": {
                        "id": "/properties/events/items",
                        "properties": {
                            "Birthday": {
                                "id": "/properties/events/items/properties/Birthday",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "firstname": {
                    "id": "/properties/firstname",
                    "type": "string"
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "lastname": {
                    "id": "/properties/lastname",
                    "type": "string"
                },
                "mx": {
                    "id": "/properties/mx",
                    "items": {
                        "id": "/properties/mx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "org": {
                    "id": "/properties/org",
                    "items": {
                        "id": "/properties/org/items",
                        "properties": {
                            "current": {
                                "id": "/properties/org/items/properties/current",
                                "properties": {
                                    "org_dept": {
                                        "id": "/properties/org/items/properties/current/properties/org_dept",
                                        "type": "string"
                                    },
                                    "org_name": {
                                        "id": "/properties/org/items/properties/current/properties/org_name",
                                        "type": "string"
                                    },
                                    "org_title": {
                                        "id": "/properties/org/items/properties/current/properties/org_title",
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 3
                },
                "phone": {
                    "id": "/properties/phone",
                    "items": {
                        "id": "/properties/phone/items",
                        "properties": {
                            "phone": {
                                "id": "/properties/phone/items/properties/phone",
                                "type": "string",
                                "minLength": 1
                            }
                        },
                        "type": "object",
                        "minProperties": 1
                    },
                    "type": "array",
                    "minItems": 1
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modNo": {
                                "id": "/properties/process/items/properties/modNo",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "profilecx": {
                    "id": "/properties/profilecx",
                    "type": "string"
                },
                "relation": {
                    "id": "/properties/relation",
                    "items": {
                        "id": "/properties/relation/items",
                        "properties": {
                            "Assistant": {
                                "id": "/properties/relation/items/properties/Assistant",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "sharedx": {
                    "id": "/properties/sharedx",
                    "items": {
                        "id": "/properties/sharedx/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "social": {
                    "id": "/properties/social",
                    "items": {
                        "id": "/properties/social/items",
                        "properties": {
                            "LinkedIn": {
                                "id": "/properties/social/items/properties/LinkedIn",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "required": ["displayname", "phone", "owner", "type", "archivedx"]
      }
     ;

        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return false;
    }

    dxpSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cx",
            "properties": {
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "ax": {
                    "id": "/properties/ax",
                    "type": "string",
                    "minLength": 1
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "cxcount": {
                    "id": "/properties/cxcount",
                    "type": "string"
                },
                "dx_sharing_status": {
                    "id": "/properties/dx_sharing_status",
                    "type": "string"
                },
                "dxid": {
                    "id": "/properties/dxid",
                    "type": "string",
                    "minLength": 3
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "isnew": {
                    "id": "/properties/isnew",
                    "type": "string"
                },
                "nxtimestamp": {
                    "id": "/properties/nxtimestamp",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string"
                },
                "position": {
                    "id": "/properties/position",
                    "type": "integer"
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1

                },
                "update": {
                    "id": "/properties/update",
                    "type": "string"
                }
            },
            "type": "object",
            "required": ["type", "dxid", "ax"]
        };
        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }
    ;
    dxMycontactsSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "dx",
            "properties": {
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "backgroundcolor": {
                    "id": "/properties/backgroundcolor",
                    "type": "string"
                },
                "cat": {
                    "id": "/properties/cat",
                    "type": "string"
                },
                "creatorname": {
                    "id": "/properties/creatorname",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "dxname": {
                    "id": "/properties/dxname",
                    "type": "string",
                    "minLength": 1
                },
                "dxtype": {
                    "id": "/properties/dxtype",
                    "type": "string",
                    "minLength": 1
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "grptym": {
                    "id": "/properties/grptym",
                    "type": "string"
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "isaddcontrol": {
                    "id": "/properties/isaddcontrol",
                    "type": "boolean"
                },
                "isarchivecontrol": {
                    "id": "/properties/isarchivecontrol",
                    "type": "boolean"
                },
                "nickname": {
                    "id": "/properties/nickname",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 4
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "subcat": {
                    "id": "/properties/subcat",
                    "type": "string"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength": 1
                }
            },
            "type": "object",
            "required": ["dxname", "dxtype", "owner", "type"]
        };

        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }

    dxPshareSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cx",
            "properties": {
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "backgroundcolor": {
                    "id": "/properties/backgroundcolor",
                    "type": "string"
                },
                "cat": {
                    "id": "/properties/cat",
                    "type": "string"
                },
                "creatorname": {
                    "id": "/properties/creatorname",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "dxname": {
                    "id": "/properties/dxname",
                    "type": "string",
                    "minLength": 1
                },
                "dxtype": {
                    "id": "/properties/dxtype",
                    "type": "string",
                    "minLength": 1
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "grptym": {
                    "id": "/properties/grptym",
                    "type": "string"
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "isaddcontrol": {
                    "id": "/properties/isaddcontrol",
                    "type": "boolean"
                },
                "isarchivecontrol": {
                    "id": "/properties/isarchivecontrol",
                    "type": "boolean"
                },
                "mx_ps": {
                    "id": "/properties/mx_ps",
                    "properties": {
                        "-Tk-CmoqddXW_ahgrH7jxwk": {
                            "id": "/properties/mx_ps/properties/-Tk-CmoqddXW_ahgrH7jxwk",
                            "type": "string",
                            "minLength": 2
                        }
                    },
                    "type": "object",
                    "minProperties": 1
                },
                "mx_psname": {
                    "id": "/properties/mx_psname",
                    "properties": {
                        "-NEX_5JRyE5qTabjUNKYYvj": {
                            "id": "/properties/mx_psname/properties/-NEX_5JRyE5qTabjUNKYYvj",
                            "type": "string"
                        },
                        "-Tk-CmoqddXW_ahgrH7jxwk": {
                            "id": "/properties/mx_psname/properties/-Tk-CmoqddXW_ahgrH7jxwk",
                            "type": "string"
                        },
                        "-ZV8GsbPPDApEMZdner7VEm": {
                            "id": "/properties/mx_psname/properties/-ZV8GsbPPDApEMZdner7VEm",
                            "type": "string"
                        },
                        "-b-FuC5TeWQuJHdTT77F_63": {
                            "id": "/properties/mx_psname/properties/-b-FuC5TeWQuJHdTT77F_63",
                            "type": "string"
                        },
                        "mincx-919876842597": {
                            "id": "/properties/mx_psname/properties/mincx-919876842597",
                            "type": "string"
                        }
                    },
                    "type": "object",
                    "minProperties": 1
                },
                "nickname": {
                    "id": "/properties/nickname",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 4
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "subcat": {
                    "id": "/properties/subcat",
                    "type": "string"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string"
                }
            },
            "type": "object",
            "required": ["dxname", "dxtype", "owner", "type"]
        };

        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }

    dxGshareSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "cx",
            "properties": {
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "backgroundcolor": {
                    "id": "/properties/backgroundcolor",
                    "type": "string"
                },
                "cat": {
                    "id": "/properties/cat",
                    "type": "string"
                },
                "creatorname": {
                    "id": "/properties/creatorname",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "dxname": {
                    "id": "/properties/dxname",
                    "type": "string",
                    "minLength": 1
                },
                "dxtype": {
                    "id": "/properties/dxtype",
                    "type": "string",
                    "minLength": 1
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "grptym": {
                    "id": "/properties/grptym",
                    "type": "string"
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "isaddcontrol": {
                    "id": "/properties/isaddcontrol",
                    "type": "boolean"
                },
                "isarchivecontrol": {
                    "id": "/properties/isarchivecontrol",
                    "type": "boolean"
                },
                "mxarr": {
                    "id": "/properties/mxarr",
                    "items": {
                        "id": "/properties/mxarr/items",
                        "type": "string"
                    },
                    "type": "array",
                    "minItem": 1
                },
                "nickname": {
                    "id": "/properties/nickname",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength": 4
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "roles": {
                    "id": "/properties/roles",
                    "items": {
                        "id": "/properties/roles/items",
                        "properties": {
                            "-EBKkBreenP1e7pHvaBSOJZ": {
                                "id": "/properties/roles/items/properties/-EBKkBreenP1e7pHvaBSOJZ",
                                "items": {
                                    "id": "/properties/roles/items/properties/-EBKkBreenP1e7pHvaBSOJZ/items",
                                    "type": "string"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "subcat": {
                    "id": "/properties/subcat",
                    "type": "string"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string"
                }
            },
            "type": "object",
            "required": ["dxname", "dxtype", "owner", "type", "mxarr"]
        }
        ;

        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            console.log(valRes.errors);
            return valRes.errors;
        }
        return returnFlag;
    }

    dirocardSchemaValidate(jsonData) {
        var returnFlag = 0;
        var Schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "definitions": {},
            "id": "http://example.com/example.json",
            "properties": {
                "address": {
                    "id": "/properties/address",
                    "items": {
                        "id": "/properties/address/items",
                        "properties": {
                            "home": {
                                "id": "/properties/address/items/properties/home",
                                "items": {
                                    "id": "/properties/address/items/properties/home/items",
                                    "properties": {
                                        "country": {
                                            "id": "/properties/address/items/properties/home/items/properties/country",
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "authmx": {
                    "id": "/properties/authmx",
                    "type": "string"
                },
                "backgroundcolor": {
                    "id": "/properties/backgroundcolor",
                    "type": "string"
                },
//                "crtime": {
//                    "id": "/properties/crtime",
//                    "type": "string"
//                },
                "displayname": {
                    "id": "/properties/displayname",
                    "items": {
                        "id": "/properties/displayname/items",
                        "type": "string",
                        "minLength":1
                    },
                    "type": "array",
                    "minItems":1
                },
                "dx": {
                    "id": "/properties/dx",
                    "properties": {
                        "0aca1132-a470-415c-8101-6b6940c4a2ad": {
                            "id": "/properties/dx/properties/0aca1132-a470-415c-8101-6b6940c4a2ad",
                            "type": "string"
                        },
                        "7f4ce9a0-9416-4bc9-9c0b-8639308ad2ba": {
                            "id": "/properties/dx/properties/7f4ce9a0-9416-4bc9-9c0b-8639308ad2ba",
                            "type": "string"
                        }
                    },
                    "type": "object"
                },
                "email": {
                    "id": "/properties/email",
                    "items": {
                        "id": "/properties/email/items",
                        "properties": {
                            "work": {
                                "id": "/properties/email/items/properties/work",
                                "items": {
                                    "id": "/properties/email/items/properties/work/items",
                                    "type": "string"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
//                "eptime": {
//                    "id": "/properties/eptime",
//                    "type": "string"
//                },
                "features": {
                    "id": "/properties/features",
                    "properties": {
                        "a": {
                            "id": "/properties/features/properties/a",
                            "properties": {
                                "status": {
                                    "id": "/properties/features/properties/a/properties/status",
                                    "type": "boolean"
                                }
                            },
                            "type": "object"
                        },
                        "b": {
                            "id": "/properties/features/properties/b",
                            "properties": {
                                "status": {
                                    "id": "/properties/features/properties/b/properties/status",
                                    "type": "boolean"
                                }
                            },
                            "type": "object"
                        },
                        "m": {
                            "id": "/properties/features/properties/m",
                            "properties": {
                                "status": {
                                    "id": "/properties/features/properties/m/properties/status",
                                    "type": "boolean"
                                }
                            },
                            "type": "object"
                        },
                        "p": {
                            "id": "/properties/features/properties/p",
                            "properties": {
                                "status": {
                                    "id": "/properties/features/properties/p/properties/status",
                                    "type": "boolean"
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                },
                "firstname": {
                    "id": "/properties/firstname",
                    "items": {
                        "id": "/properties/firstname/items",
                        "type": "string",
                        "minLength":1
                    },
                    "type": "array",
                    "minItems":1
                },
                "image": {
                    "id": "/properties/image",
                    "items": {
                        "id": "/properties/image/items",
                        "properties": {
                            "active": {
                                "id": "/properties/image/items/properties/active",
                                "type": "string"
                            },
                            "bytesize": {
                                "id": "/properties/image/items/properties/bytesize",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "imagelist": {
                    "id": "/properties/imagelist",
                    "items": {
                        "id": "/properties/imagelist/items",
                        "properties": {
                            "9c68b55c-3cda-4d3a-88ec-f14de01c7ed6": {
                                "id": "/properties/imagelist/items/properties/9c68b55c-3cda-4d3a-88ec-f14de01c7ed6",
                                "items": {
                                    "id": "/properties/imagelist/items/properties/9c68b55c-3cda-4d3a-88ec-f14de01c7ed6/items",
                                    "type": "string"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "lastname": {
                    "id": "/properties/lastname",
                    "items": {
                        "id": "/properties/lastname/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "mx": {
                    "id": "/properties/mx",
                    "items": {
                        "id": "/properties/mx/items",
                        "type": "string",
                        "minLength":1
                    },
                    "type": "array",
                    "minItems":1
                },
                "org": {
                    "id": "/properties/org",
                    "items": {
                        "id": "/properties/org/items",
                        "properties": {
                            "current": {
                                "id": "/properties/org/items/properties/current",
                                "properties": {
                                    "org_eptime": {
                                        "id": "/properties/org/items/properties/current/properties/org_eptime",
                                        "type": "string"
                                    },
                                    "org_name": {
                                        "id": "/properties/org/items/properties/current/properties/org_name",
                                        "items": {
                                            "id": "/properties/org/items/properties/current/properties/org_name/items",
                                            "type": "string"
                                        },
                                        "type": "array"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "os": {
                    "id": "/properties/os",
                    "type": "string"
                },
                "owner": {
                    "id": "/properties/owner",
                    "type": "string",
                    "minLength":1
                },
                "phone": {
                    "id": "/properties/phone",
                    "items": {
                        "id": "/properties/phone/items",
                        "properties": {
                            "mobile": {
                                "id": "/properties/phone/items/properties/mobile",
                                "items": {
                                    "id": "/properties/phone/items/properties/mobile/items",
                                    "type": "string"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array",
                    "minItems":1
                },
                "process": {
                    "id": "/properties/process",
                    "items": {
                        "id": "/properties/process/items",
                        "properties": {
                            "action": {
                                "id": "/properties/process/items/properties/action",
                                "type": "string"
                            },
                            "buildver": {
                                "id": "/properties/process/items/properties/buildver",
                                "type": "string"
                            },
                            "deviceid": {
                                "id": "/properties/process/items/properties/deviceid",
                                "type": "string"
                            },
                            "docver": {
                                "id": "/properties/process/items/properties/docver",
                                "type": "string"
                            },
                            "func": {
                                "id": "/properties/process/items/properties/func",
                                "type": "string"
                            },
                            "modno": {
                                "id": "/properties/process/items/properties/modno",
                                "type": "string"
                            },
                            "os": {
                                "id": "/properties/process/items/properties/os",
                                "type": "string"
                            },
                            "sysver": {
                                "id": "/properties/process/items/properties/sysver",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "social": {
                    "id": "/properties/social",
                    "items": {
                        "id": "/properties/social/items",
                        "properties": {
                            "discard": {
                                "id": "/properties/social/items/properties/discard",
                                "items": {
                                    "id": "/properties/social/items/properties/discard/items",
                                    "type": "string"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "type": {
                    "id": "/properties/type",
                    "type": "string",
                    "minLength":1
                },
                "verifiedcount": {
                    "id": "/properties/verifiedcount",
                    "properties": {
                        "email": {
                            "id": "/properties/verifiedcount/properties/email",
                            "properties": {
                                "accepted": {
                                    "id": "/properties/verifiedcount/properties/email/properties/accepted",
                                    "type": "integer"
                                },
                                "discarded": {
                                    "id": "/properties/verifiedcount/properties/email/properties/discarded",
                                    "type": "string"
                                }
                            },
                            "type": "object"
                        },
                        "image": {
                            "id": "/properties/verifiedcount/properties/image",
                            "properties": {
                                "accepted": {
                                    "id": "/properties/verifiedcount/properties/image/properties/accepted",
                                    "type": "integer"
                                },
                                "discarded": {
                                    "id": "/properties/verifiedcount/properties/image/properties/discarded",
                                    "type": "integer"
                                }
                            },
                            "type": "object"
                        },
                        "phone": {
                            "id": "/properties/verifiedcount/properties/phone",
                            "properties": {
                                "accepted": {
                                    "id": "/properties/verifiedcount/properties/phone/properties/accepted",
                                    "type": "integer"
                                },
                                "discarded": {
                                    "id": "/properties/verifiedcount/properties/phone/properties/discarded",
                                    "type": "integer"
                                }
                            },
                            "type": "object"
                        },
                        "social": {
                            "id": "/properties/verifiedcount/properties/social",
                            "properties": {
                                "accepted": {
                                    "id": "/properties/verifiedcount/properties/social/properties/accepted",
                                    "type": "string"
                                },
                                "discarded": {
                                    "id": "/properties/verifiedcount/properties/social/properties/discarded",
                                    "type": "integer"
                                }
                            },
                            "type": "object"
                        },
                        "website": {
                            "id": "/properties/verifiedcount/properties/website",
                            "properties": {
                                "accepted": {
                                    "id": "/properties/verifiedcount/properties/website/properties/accepted",
                                    "type": "string"
                                },
                                "discarded": {
                                    "id": "/properties/verifiedcount/properties/website/properties/discarded",
                                    "type": "string"
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                },
                "website": {
                    "id": "/properties/website",
                    "items": {
                        "id": "/properties/website/items",
                        "properties": {
                            "homepage": {
                                "id": "/properties/website/items/properties/homepage",
                                "items": {
                                    "id": "/properties/website/items/properties/homepage/items",
                                    "type": "string"
                                },
                                "type": "array"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                }
            },
            "type": "object",
            "required":['type','mx','owner','firstname','displayname','phone']
            };

        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return returnFlag;
    }
    ;
    mxSchemValidate(jsonData) {
        var Schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {},
    "id": "http://example.com/example.json",
    "properties": {
        "authmx": {
            "id": "/properties/authmx",
            "type": "string"
        },
//        "crtime": {
//            "id": "/properties/crtime",
//            "type": "string"
//        },
        "defaultdx": {
            "id": "/properties/defaultdx",
            "type": "string"
        },
        "dv": {
            "id": "/properties/dv",
            "items": {
                "id": "/properties/dv/items",
                "properties": {
                    "UDID": {
                        "id": "/properties/dv/items/properties/UDID",
                        "type": "string"
                    },
                    "carrierName": {
                        "id": "/properties/dv/items/properties/carrierName",
                        "type": "string"
                    },
                    "deviceToken": {
                        "id": "/properties/dv/items/properties/deviceToken",
                        "type": "string"
                    },
                    "installVersion": {
                        "id": "/properties/dv/items/properties/installVersion",
                        "type": "string"
                    },
                    "modelNumber": {
                        "id": "/properties/dv/items/properties/modelNumber",
                        "type": "string"
                    },
                    "os": {
                        "id": "/properties/dv/items/properties/os",
                        "type": "string"
                    },
                    "platform": {
                        "id": "/properties/dv/items/properties/platform",
                        "type": "string"
                    },
                    "systemVersion": {
                        "id": "/properties/dv/items/properties/systemVersion",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
//        "eptime": {
//            "id": "/properties/eptime",
//            "type": "string"
//        },
        "firstname": {
            "id": "/properties/firstname",
            "type": "string",
            "minLength":1
        },
        "lastname": {
            "id": "/properties/lastname",
            "type": "string"
        },
        "mcc": {
            "id": "/properties/mcc",
            "type": "string",
            "minLength":1
        },
        "mobile": {
            "id": "/properties/mobile",
            "type": "string",
            "minLength":4
        },
        "modified": {
            "id": "/properties/modified",
            "type": "string"
        },
        "owner": {
            "id": "/properties/owner",
            "type": "string",
            "minLength":3
        },
        "process": {
            "id": "/properties/process",
            "items": {
                "id": "/properties/process/items",
                "properties": {
                    "action": {
                        "id": "/properties/process/items/properties/action",
                        "type": "string"
                    },
                    "buildver": {
                        "id": "/properties/process/items/properties/buildver",
                        "type": "string"
                    },
                    "deviceid": {
                        "id": "/properties/process/items/properties/deviceid",
                        "type": "string"
                    },
                    "docver": {
                        "id": "/properties/process/items/properties/docver",
                        "type": "string"
                    },
                    "func": {
                        "id": "/properties/process/items/properties/func",
                        "type": "string"
                    },
                    "modno": {
                        "id": "/properties/process/items/properties/modno",
                        "type": "string"
                    },
                    "os": {
                        "id": "/properties/process/items/properties/os",
                        "type": "string"
                    },
                    "sysver": {
                        "id": "/properties/process/items/properties/sysver",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "type": {
            "id": "/properties/type",
            "type": "string"
        }
    },
    "type": "object",
    "required":['mobile','firstname','dv','mcc','owner']
};
        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return false;
    }
    ;
    mediaOrignalSchemValidate(jsonData) {
     var Schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {},
    "id": "http://example.com/example.json",
    "properties": {
        "_attachments": {
            "id": "/properties/_attachments",
            "properties": {
                "3ee29269-bbb3-4345-aeb3-9873f665418e": {
                    "id": "/properties/_attachments/properties/3ee29269-bbb3-4345-aeb3-9873f665418e",
                    "properties": {
                        "content_type": {
                            "id": "/properties/_attachments/properties/3ee29269-bbb3-4345-aeb3-9873f665418e/properties/content_type",
                            "type": "string"
                        },
                        "digest": {
                            "id": "/properties/_attachments/properties/3ee29269-bbb3-4345-aeb3-9873f665418e/properties/digest",
                            "type": "string"
                        },
                        "length": {
                            "id": "/properties/_attachments/properties/3ee29269-bbb3-4345-aeb3-9873f665418e/properties/length",
                            "type": "integer",
                            "minLength":3000
                        },
                        "revpos": {
                            "id": "/properties/_attachments/properties/3ee29269-bbb3-4345-aeb3-9873f665418e/properties/revpos",
                            "type": "integer"
                        },
                        "stub": {
                            "id": "/properties/_attachments/properties/3ee29269-bbb3-4345-aeb3-9873f665418e/properties/stub",
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                }
            },
            "type": "object"
        },
        "_id": {
            "id": "/properties/_id",
            "type": "string"
        },
        "authmx": {
            "id": "/properties/authmx",
            "type": "string"
        },
        "crtime": {
            "id": "/properties/crtime",
            "type": "string"
        },
        "cxid": {
            "id": "/properties/cxid",
            "items": {
                "id": "/properties/cxid/items",
                "type": "string"
            },
            "type": "array"
        },
        "eptime": {
            "id": "/properties/eptime",
            "type": "string"
        },
        "os": {
            "id": "/properties/os",
            "type": "string"
        },
        "owner": {
            "id": "/properties/owner",
            "type": "string"
        },
        "process": {
            "id": "/properties/process",
            "items": {
                "id": "/properties/process/items",
                "properties": {
                    "action": {
                        "id": "/properties/process/items/properties/action",
                        "type": "string"
                    },
                    "buildver": {
                        "id": "/properties/process/items/properties/buildver",
                        "type": "string"
                    },
                    "deviceid": {
                        "id": "/properties/process/items/properties/deviceid",
                        "type": "string"
                    },
                    "docver": {
                        "id": "/properties/process/items/properties/docver",
                        "type": "string"
                    },
                    "func": {
                        "id": "/properties/process/items/properties/func",
                        "type": "string"
                    },
                    "modno": {
                        "id": "/properties/process/items/properties/modno",
                        "type": "string"
                    },
                    "os": {
                        "id": "/properties/process/items/properties/os",
                        "type": "string"
                    },
                    "sysver": {
                        "id": "/properties/process/items/properties/sysver",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "type": {
            "id": "/properties/type",
            "type": "string"
        }
    },
    "type": "object",
    "required": ["_attachments","type"]
};
        var valRes = v.validate(jsonData, Schema);
        if (valRes.errors.length != 0) {
            return valRes.errors;
        }
        return false;
    }
    ;
    
    checkJsonWithSchema(jsonData) {
        switch (jsonData.type) {

            case 'cxdx':
                var resFlag = this.cxdxSchemaValidate(jsonData);
                break;

            case 'cxp':
                var resFlag = this.cxpSchemaValidate(jsonData);
                break;

            case 'cx':
                
                if (jsonData.dx !== undefined) {
                    var resFlag = this.cxWithDxSchemaValidate(jsonData);
                } else if (jsonData.archivedx !== undefined) {
                    var resFlag = this.cxWithArchivedxSchemaValidate(jsonData);
                } else if (jsonData.sharedx !== undefined) {
                    var resFlag = this.cxWithSharedxSchemaValidate(jsonData);
                } else {
                    var resflag = undefined;
//                    var DxOfCx = "dx missing";
//                    return DxOfCx;
                }
                break;

            case 'dxp':
                var resFlag = this.dxpSchemaValidate(jsonData);
                break;

            case 'dx':

                if ((jsonData.dxtype.toLowerCase() == 'private') && (jsonData.dxname.toLowerCase().trim() == 'my contacts')) {
                    var resFlag = this.dxMycontactsSchemaValidate(jsonData);
                } else if ((jsonData.dxtype.toLowerCase() == 'private') && (jsonData.dxname.toLowerCase().trim() != 'my contacts')) {
                    var resFlag = this.dxPshareSchemaValidate(jsonData);
                } else if (jsonData.dxtype.toLowerCase() == 'group') {
                    var resFlag = this.dxGshareSchemaValidate(jsonData);
                } else {
                    var resflag = undefined;
                    var dxtypeAnddxname = "dxtype or dxname missing";
                    return dxtypeAnddxname;
                }
                break;

            case 'dirocard':
                var resFlag = this.dirocardSchemaValidate(jsonData);
                break;

            case 'mx':
                var resFlag = this.mxSchemValidate(jsonData);
                break;
               
            //media data check
            case 'orignal':
                var resFlag = this.mediaOrignalSchemValidate(jsonData);
                break;
                
            case 'thumb':
                var resFlag = this.mediaOrignalSchemValidate(jsonData);
                break;
                
            case 'cximage':
                var resFlag = this.mediaOrignalSchemValidate(jsonData);
                break;
                
            case 'dximage':
                var resFlag = this.mediaOrignalSchemValidate(jsonData);
                break;
        }
        return resFlag;
     }
    ;
    
}

const jsonObj = new JsonSchemaValidator();

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};



exports.validJson = function(req,res){
 
    
    var reqData  = req.body;
  
    if(reqData._id){
        if(reqData._rev !== undefined){
            jsonObj.docReplicate(reqData);
        }
        var docId    = reqData._id;
        var docType  = reqData.type;
        var docOwner = reqData.owner;
   } 

//    console.log('For schema test forword');
    
    var returnData = jsonObj.checkJsonWithSchema(reqData);

   if(returnData){
     if(docId){ 
       var writeError  = 'Schema Fail Of '+ docType +' '+ docId + ' '+ returnData;
       var NotifyError = docId + ' '+ returnData;
       var resErr      = [docType+' '+docId,'Schema Fail '+returnData];
        
      
       shadowBucket.get(docOwner, function(err, result) {
                    if (err) {
                      // Failed to retrieve key
                      var logger = new (winston.Logger)({
                      transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC54',owner:docOwner}
                            })
                      ]
                    });
                    logger.error('EC54 '+err);
                    }else{
                     if(result.value !== undefined){
                      var doc = result.value.dv;
                     }
                     
                    if(doc !== undefined){
//                        var os = doc[0].os;
                        var deviceToken = doc[0].deviceToken;
                        var platform = doc[0].platform;
                        var modelNumber = doc[0].modelNumber;
                        var ios  = modelNumber;
                        
                        if(ios.toLowerCase() == 'iphone'){
                            if(deviceToken != undefined){
                               var deviceToken = deviceToken.toLowerCase();
                               var Notification = require('node_apns').Notification,	
                                n = Notification(deviceToken, {aps:{"alert":NotifyError, "sound":"default"}});
                                if (n.isValid()) {
                                    push.sendNotification(n);
                                }
                            }
                        }else{
                             if(deviceToken !== undefined){
                                sendMessageToUser(deviceToken,{ message: NotifyError});
                            }
                        }
                    }
                }

       });
       
        switch (reqData.type.toLowerCase()) {

            case 'cx':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC8',owner:docOwner,documentId:docId}
                            })
                    ]
                });
                logger.error('EC8 '+returnData);
                
                break;
            case 'cxp':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC4',owner:docOwner,documentId:docId}
                            })
                    ]
                });
                logger.warn('EC4 '+returnData);
                
                break;
            case 'mx':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                             dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC15',owner:docOwner,documentId:docId}
                            })
                    ]
                });
                logger.error('EC15 '+returnData);
                
                break;
            case 'dx':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC20',owner:docOwner,documentId:docId}
                            })
                    ]
                });
                logger.error('EC20 '+returnData);
                
                break;
            case 'dxp':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC26',owner:docOwner,documentId:docId}
                            })
                    ]
                });
                logger.error('EC26 '+returnData);
                
                break;
                
            case 'dirocard':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC52',owner:docOwner,documentId:docId}
                            })
                    ]
                });
                logger.error('EC52 '+returnData);
                
                break;
                
            case 'cxdx':
                
                var logger = new (winston.Logger)({
                    transports: [
                         new (winston.transports.Console)({level:'error'}),
                         new Sentry({
                              dsn: dsn,
                                tags: { doctype: docType, errorCode: 'EC53',owner: docOwner,documentId:docId}
                            })
                    ]
                });
                logger.error('EC53 '+returnData);
                
                break;
        }
       
      
            
//            logger.log('warn','EC4 '+returnData);
//            logger.info('EC4 '+returnData);
//            logger.error('EC4 '+returnData);
//            logger.warn('EC4 '+returnData);
            
            res.send(resErr);
    }

  }else{
//      console.log('valid');
      res.send(null);
  }
  
 };
