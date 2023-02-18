const distanceLoc = [];

// data in json format

const data = [
  {
    num: 1,
    id: "A1",
    longi: `78° 02' 48.0"E`,
    lati: `22° 07' 06.2"N`,
    markerType: "A",
  },
  {
    num: 2,
    id: "A2",
    longi: `78° 02' 47.12"E`,
    lati: `22° 07' 06.3"N`,
    markerType: "A",
  },
  {
    num: 3,
    id: "B1",
    longi: `78° 02' 48.23"E`,
    lati: `22° 07' 06.4"N`,
    markerType: "B",
  },
  {
    num: 4,
    id: "B2",
    longi: `78° 02' 47.34"E`,
    lati: `22° 07' 06.5"N`,
    markerType: "B",
  },
  {
    num: 5,
    id: "C1",
    longi: `78° 02' 46.45"E`,
    lati: `22° 07' 07.6"N`,
    markerType: "C",
  },
  {
    num: 6,
    id: "A3",
    longi: `78° 02' 46.56"E `,
    lati: `22° 07' 06.7"N`,
    markerType: "A",
  },
  {
    num: 7,
    id: "C2",
    longi: `78° 02' 46.67"E`,
    lati: `22° 07' 06.8"N`,
    markerType: "C",
  },
  {
    num: 8,
    id: "C3",
    longi: `78° 02' 43.78"E`,
    lati: `22° 07' 06.9"N`,
    markerType: "C",
  },
  {
    num: 9,
    id: "C4",
    longi: `78° 02' 43.89"E`,
    lati: `22° 07' 06.0"N`,
    markerType: "C",
  },
  {
    num: 10,
    id: "B3",
    longi: `78° 02' 43.60"E`,
    lati: `22° 07' 06.15"N`,
    markerType: "B",
  },
  {
    num: 11,
    id: "B4",
    longi: `78° 02' 42.08"E`,
    lati: `22° 07' 06.25"N`,
    markerType: "B",
  },
];
// list of markers

var markers = [];

// colors for markers

var red = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var green = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
var yellow = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

// converting dms into degrees

function ParseDMS(input) {
  var parts = input.split(/[^\d\w.]+/);
  var dege = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  // LatArr.push(dege);
  return dege;
}
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var deg = Number(degrees);
  var min = Number(minutes / 60);
  var sec = Number(seconds / 3600);

  var dd = deg + min + sec;

  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

// map function

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: { lng: 78.04666667, lat: 22.11838889 },
  });

  Object.values(data).map((loc) => {
    var longitude = ParseDMS(loc.longi);
    var latitude = ParseDMS(loc.lati);
    var MarkerType = loc.markerType;
    //   let Buldi = { lat: latitude, lng: longitude };
    addMarker(latitude, longitude, MarkerType);
  });

  function addMarker(latitude, longitude, MarkerType) {
    let marker = new google.maps.Marker({
      position: { lng: longitude, lat: latitude },
      label: MarkerType,
      map: map,
      icon: {
        path: google.maps.SymbolPath.Marker,
        url: MarkerType == "A" ? red : MarkerType == "B" ? green : yellow,
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 10,
        scale: 30,
      },
    });
    markers.push(marker);

    // calculate distace between two markers


    google.maps.event.addListener(
      marker,
      "click",
      (function (marker) {
        return function (evt) {
          var loca = {
            lng: marker.getPosition().lng(),
            lat: marker.getPosition().lat(),
            label: marker.label 
          };
          

          if (distanceLoc.length === 0) {
            distanceLoc.push(loca);
          } else if (distanceLoc[0] === loca) {
            distanceLoc.push(loca);
            distanceLoc.pop();
          } else if (distanceLoc.length === 1) {
            distanceLoc.push(loca);
            if(distanceLoc[0].label === distanceLoc[1].label){
              calculateDistance(distanceLoc[0], distanceLoc[1])
            }else{
              alert("Two Markers are not of same type");
            }
          } else if (distanceLoc.length > 0 && distanceLoc.length < 3) {
            distanceLoc.length = 0;
            distanceLoc.push(loca);
          } else {
          }
          // console.log(distanceLoc);
        };
      })(marker)
    );
  }
  function calculateDistance(source, destination){
    var x1 = source.lng
    var y1 = source.lat
    var x2 = destination.lng
    var y2 = destination.lat

    var flightPath = new google.maps.Polyline({
      path: [{lat: y1, lng: x1}, {lat:y2,lng:x2}],
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    flightPath.setMap(map);

    var distance = getDistance(x1,y1,x2,y2).toFixed(4)
    alert("The Distance Between Two Markers is :"+ distance +"Km" );
  }
function getDistance(x1,y1,x2,y2){
  var xDiff = x1 - x2; 
	var yDiff = y1 - y2; 

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
  let A = document.getElementById("show-marker-type-a");
  A.addEventListener("change", removeMarkerofA);

  let B = document.getElementById("show-marker-type-b");
  B.addEventListener("change", removeMarkerofB);

  let C = document.getElementById("show-marker-type-c");
  C.addEventListener("change", removeMarkerofC);

  function setMapOnA(map) {
    markers.forEach((element) => {
      if (element.label === "A") {
        element.setMap(map);
      }
    });
  }

  function setMapOnB(map) {
    markers.forEach((element) => {
      if (element.label === "B") {
        element.setMap(map);
      }
    });
  }
  function setMapOnC(map) {
    markers.forEach((element) => {
      if (element.label === "C") {
        element.setMap(map);
      }
    });
  }

  function removeMarkerofA() {
    if (A.checked) {
      setMapOnA(map);
    } else {
      setMapOnA(null);
    }
  }

  function removeMarkerofB() {
    if (B.checked) {
      setMapOnB(map);
    } else {
      setMapOnB(null);
    }
  }

  function removeMarkerofC() {
    if (C.checked) {
      setMapOnC(map);
    } else {
      setMapOnC(null);
    }
  }
}


// var service = new google.maps.DistanceMatrixService();
//     service.getDistanceMatrix({
//       origins: [source],
//       destinations: [destination],
//       travelMode: 'DRIVING',
//       unitSystem: google.maps.UnitSystem.METRIC,
//       avoidHighways: false,
//       avoidTolls: false
//     },function(response, status) {
//       if (status !== 'OK') {
//         alert('Error was: ' + status);
//       } else {
//         distance = response.rows[0].elements[0].distance.text;
//         console.log(distance);
//         var infowindow = new google.maps.InfoWindow({
//           content: 'Distance: ' + distance
//         });
//         infowindow.open(map, source);
//       }
//     })
