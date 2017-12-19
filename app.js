var app = angular.module('exportToPdf', ['nvd3'])

.controller('AppCtrl', function($scope) {
  $scope.options = {
      chart: {
          type: 'lineChart',
          height: 180,
          margin : {
              top: 20,
              right: 20,
              bottom: 40,
              left: 55
          },
          x: function(d){ return d.x; },
          y: function(d){ return d.y; },
          useInteractiveGuideline: true,
          duration: 500,    
          yAxis: {
              tickFormat: function(d){
                 return d3.format('.01f')(d);
              }
          }
      }
  };
  
  $scope.options1 = angular.copy($scope.options);
  $scope.options1.chart.duration = 0;
  $scope.options1.chart.yDomain = [-1,1];
  
  $scope.data = [{ values: [], key: 'Random Walk' }];
  

  $scope.barChartOptions = {
      chart: {
          type: 'discreteBarChart',
          height: 450,
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
          },
          x: function(d){ return d.label; },
          y: function(d){ return d.value; },
          showValues: true,
          valueFormat: function(d){
              return d3.format(',.4f')(d);
          },
          transitionDuration: 500,
          xAxis: {
              axisLabel: 'X Axis'
          },
          yAxis: {
              axisLabel: 'Y Axis',
              axisLabelDistance: 30
          }
      }
  };

  $scope.barChartData = [{
    key: "Cumulative Return",
    values: [
        { "label" : "A" , "value" : -29.765957771107 },
        { "label" : "B" , "value" : 0 },
        { "label" : "C" , "value" : 32.807804682612 },
        { "label" : "D" , "value" : 196.45946739256 },
        { "label" : "E" , "value" : 0.19434030906893 },
        { "label" : "F" , "value" : -98.079782601442 },
        { "label" : "G" , "value" : -13.925743130903 },
        { "label" : "H" , "value" : -5.1387322875705 }
    ]
  }];

  $scope.run = true;
    
  var x = 0;
  setInterval(function(){
    if (!$scope.run) return;
    $scope.data[0].values.push({ x: x,	y: Math.random() - 0.5});
    if ($scope.data[0].values.length > 20) $scope.data[0].values.shift();
    x++;
    
    $scope.$apply(); // update both chart
  }, 500); 

  $scope.toggle = function(){
  	$scope.run = !$scope.run;
  }
		
	function resetDefaultStyles(doc) {
	  doc.fillColor('black')
	     .fillOpacity(1)
	     .strokeColor('black')
	     .strokeOpacity(1)
	     .lineWidth(1)
	     .undash()
	     .fontSize(12)
	     .font('Helvetica');
	}

	$scope.createPdf = function(svgContainer, fileName){
		var doc = new PDFDocument({size: 'legal',layout: 'landscape',compress: false}); // It's easier to find bugs with uncompressed files
    
		var svgElement = document.getElementById(svgContainer).getElementsByTagName("svg")[0];
		var hiddenDiv = document.getElementById('hidden-div');
	  hiddenDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + svgElement.innerHTML + '</svg>';
	  SVGtoPDF(doc, hiddenDiv.firstChild, 0, 0, {useCSS:true});
	  let stream = doc.pipe(blobStream());
		stream.on('finish', function() {
		let blob = stream.toBlob('application/pdf');
		if (navigator.msSaveOrOpenBlob) {
		  navigator.msSaveOrOpenBlob(blob, fileName +'-' +Date.now()+'.pdf');
		} else {
		  download_pdf(fileName +'-' +Date.now()+'.pdf', URL.createObjectURL(blob));
		}
		});
		doc.end();
	}
});
