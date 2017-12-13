//документация: http://vlife.lastshelter.net:1337/docs/
// файл ТЕСНО связан со страницей.

// для календаря
$(function(){
    $('input[id="dateStartEnd"]').daterangepicker({
        locale: {
        format: 'DD.MM.YYYY'
        }
    });
});
$(function(){
    $('input[id="dateRepeatEnd"]').daterangepicker({
        singleDatePicker: true,
        locale: {
            format: 'DD.MM.YYYY'
        }
    });
});

// google Place
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13
    });

    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
        });
        marker.setVisible(true);

        document.getElementById('place-name').textContent = place.name;
        document.getElementById('place-id').textContent = place.place_id;
        document.getElementById('place-address').textContent =
            place.formatted_address;
        infowindow.setContent(document.getElementById('infowindow-content'));
        infowindow.open(map, marker);
    });
}

var inviteButton = document.querySelector('#invite');
inviteButton.onclick = function () {
    var newElem = document.createElement('div');
    newElem.innerHTML =
        '<input type="text" class="form-control formInvite" placeholder="Number of user">' +
        '<input type="text" class="form-control formInvite" placeholder="Phone">'  +
        '<input type="text" class="form-control formInvite" placeholder="Email">' ;
    inviteButton.parentNode.appendChild(newElem);

    return false;       // false submit
};