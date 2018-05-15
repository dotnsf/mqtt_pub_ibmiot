//. app.js
var cpuu = require( 'cputilization' );
var settings = require( './settings' );
var interval = settings.interval || 1000;

var mqtt = require( 'mqtt' );

var deviceId = settings.deviceId || getDeviceId();
var client = mqtt.connect( settings.serverURL, { clientId: 'd:quickstart:' + settings.deviceType + ':' + deviceId } );

var cnt = 0;
var angle_diff = Math.PI / 6;

var sampler = cpuu( { timeout: interval } );
sampler.on( 'sample', function( sample ){
  //. CPU
  var cpu = sample.percentageBusy();

  //. Sin/Cos/Random
  var angle = ( cnt % 12 ) * angle_diff;
  var sin = Math.sin( angle );
  var cos = Math.cos( angle );
  var random = Math.random();

  //. Timestamp
  var timestamp = ( new Date() ).getTime();

  var data = {
    count: cnt,
    timestamp: timestamp,
    cpu: cpu,
    sin: sin,
    cos: cos,
    random: random
  };

  client.publish( settings.topic, JSON.stringify( data ), function( err ){
    if( err ){
      console.log( err );
    }else{
    }
  });

  cnt ++;
});

function getDeviceId(){
  var did = '';
  var hx = '0123456789abcdef';
  for( var i = 0; i < 12; i ++ ){
    var n = Math.floor( Math.random() * 16 );
    if( n == 16 ){ n = 15; }
    c = hx.charAt( n );
    did += c;
  }

  return did;
}

client.on( 'connect', function(){
  console.log( 'client#connect : ' + deviceId );
});

