angular.module('angular.atmosphere', [])
  .service('atmosphereService', ['$rootScope', '$timeout', function($rootScope, $timeout){
    var responseParameterDelegateFunctions = ['onOpen', 'onClientTimeout', 'onReopen', 'onMessage', 'onClose', 'onError'];
    var delegateFunctions = responseParameterDelegateFunctions;
    delegateFunctions.push('onTransportFailure');
    delegateFunctions.push('onReconnect');

    return {
      subscribe: function(r){
        var result = {};
        angular.forEach(r, function(value, property){
          if(typeof value === 'function' && delegateFunctions.indexOf(property) >= 0){
            if(responseParameterDelegateFunctions.indexOf(property) >= 0)
              result[property] = function(response){
                $timeout(function(){
                  r[property](response);
                }, 0);
              };
            else if(property === 'onTransportFailure')
              result.onTransportFailure = function(errorMsg, request){
                $timeout(function(){
                  r.onTransportFailure(errorMsg, request);
                }, 0);
              };
            else if(property === 'onReconnect')
              result.onReconnect = function(request, response){
                $timeout(function(){
                  r.onReconnect(request, response);
                }, 0);
              };
          }else
            result[property] = r[property];
        });

        return atmosphere.subscribe(result);
      }
    };
  }]);