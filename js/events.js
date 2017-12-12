
/*
 * документация: http://vlife.lastshelter.net:1337/docs/
 *
 * название, макс длина 25
 * личное 0, служебное 1
 * дата начала
 * дата конца
 * репеат опшн - битовая маска,
 *      1 - Monday,
 *      2 - Tuesday,
 *      4 - Wednesday,
 *      8 - Thursday,
 *      16 - Friday,
 *      32 - Saturday,
 *      64 - Sunday.
 * конец повтора
 * описание
 * напоминание - напомнить до, напомнить за
 * место - объект с гуглПлейсАйди и адресом
 * активно - активно ли сейчас
 * приглашашки, номера юзеров, телефоны, мыла
 * AIzaSyChSqhPIvz5qBzziGXvlKF1jpMHhyMTqF4 - API_Key
 */

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

// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

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