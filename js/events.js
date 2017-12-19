//документация: http://vlife.lastshelter.net:1337/docs/
// файл ТЕСНО связан со страницей.

var id;                                 // id события

// спойлеры
$(document).ready(function(){
    $('.spoiler_links').click(function(){
        $(this).parent().children('div.spoiler_body').toggle('normal');
        return false;
    });
});

// для календаря
$(function(){
    $('input[id="dateStartEnd"]').daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        locale: {
            format: 'YYYY-MM-DDTHH:mm'
        }
    });
});
$(function(){
    $('input[id="dateRepeatEnd"]').daterangepicker({
        singleDatePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        locale: {
            format: 'YYYY-MM-DDTHH:mm'
        }
    });
});
$(function(){
    $('input[id="dateSearchEvent"]').daterangepicker({
        singleDatePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        locale: {
            format: 'YYYY-MM-DDTHH:mm'
        }
    });
});

// google Place
var placeName;
var placeID;
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

        placeName = place.name;
        placeID = place.place_id;
        document.getElementById('place-name').textContent = place.name;
        document.getElementById('place-id').textContent = place.place_id;
        document.getElementById('place-address').textContent =
            place.formatted_address;
        infowindow.setContent(document.getElementById('infowindow-content'));
        infowindow.open(map, marker);
    });
}

// invite
var inviteButton = document.querySelector('#invite');
inviteButton.onclick = function () {
    var newElem = document.createElement('div');
    newElem.innerHTML =
        '<div class="containerInvite">' +
        '<input type="text" class="form-control formInvite" placeholder="Number of user">' +
        '<input type="text" class="form-control formInvite" placeholder="Phone">'  +
        '<input type="text" class="form-control formInvite" placeholder="Email">' +
        '</div>';
    inviteButton.parentNode.appendChild(newElem);

    return false;       // false submit
};

// новое событие
var submitButton = document.querySelectorAll('.btn-success');
submitButton[0].onclick = function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();

    var query = 'http://vlife.lastshelter.net:1337/api/v1/events';
    xhr.open('POST', query, true);

    var token = localStorage.getItem('token');

    xhr.setRequestHeader('vlife-access-key', vLifeAccessKey);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('auth-token', token);

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.statusText + ": "+ xhr.responseText);
            return;
        }
        alert('Успех');

        id = (JSON.parse(token)).id;
    };
    xhr.onerror = function() {
        alert( xhr.statusText + ": "+ xhr.responseText );
    };

    var body = {
        title: "",
        sphere: 0,
        date_start: "",
        date_end: "",
        repeat_type: 1,
        repeat_option: 0,
        end_repeat: "",
        description: "",
        reminds: 0,
        location: {
            googlePlaceId: placeID,
            fullAddress: placeName
        },
        active: true,
        invites: {
            users: [],
            phones: [],
            emails: []
        }
    };
    body.title = document.querySelector('#formName').value;
    body.description = document.querySelector('#formDescription').value;
    body.reminds = + document.querySelector('#reminds').value;
    body.active = document.querySelector('input[name="formActive"]').checked;
    var cur = document.querySelector('#work');
    if (cur.checked) body.sphere = 1;
    cur = document.querySelectorAll('input[name="repRadio"]');
    for (var i = 0; i < 5; i++)
    {
        if (!cur[i].checked) continue;
        body.repeat_type = 1 << i;
        break;
    }
    cur = document.querySelectorAll('input[name="formRepeatOpt"]');
    for (i = 0; i < 7; i++)
    {
        if (!cur[i].checked) continue;
        body.repeat_option += (1 << i);
    }
    cur = document.querySelectorAll('.containerInvite');
    cur.forEach(function (item, i, arr) {
        body.invites.users.push(item.childNodes[0].value);
        body.invites.phones.push(item.childNodes[1].value);
        body.invites.emails.push(item.childNodes[2].value);
    });
    cur = document.querySelector('#dateRepeatEnd').value;
    body.end_repeat = toIso(cur);
    cur = document.querySelector('#dateStartEnd');
    var dates = cur.value.match(/\d{4}.\d{1,2}.\d{1,2}.\d{1,2}:\d{2}/ig);
    body.date_start = toIso(dates[0]);
    body.date_end = toIso(dates[1]);

    body = JSON.stringify(body);
    xhr.send(body);

    return false;
};
function toIso(inputDate) {
    return (new Date(Date.parse(inputDate))).toISOString();
}

// вывод всех событий
submitButton[1].onclick = function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();

    var query = 'http://vlife.lastshelter.net:1337/api/v1/events';
    xhr.open('GET', query, true);

    var token = localStorage.getItem('token');

    xhr.setRequestHeader('vlife-access-key', vLifeAccessKey);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('auth-token', token);

    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert(xhr.statusText + ": "+ xhr.responseText);
            return;
        }

        document.querySelector('.yourEvents').innerHTML = xhr.responseText;
    };

    xhr.onerror = function() {
        alert( xhr.statusText + ": "+ xhr.responseText );
    };

    xhr.send();
    return false;
};

// вывод событий по фильтрам
submitButton[2].onclick = function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();

    var query = 'http://vlife.lastshelter.net:1337/api/v1/events?';
    var keyword = document.querySelector('#keyWord').value;
    var date = toIso(document.querySelector('#dateSearchEvent').value);
    var type = document.querySelectorAll('input[name="searchRadio"]');
    type = type[0].checked ? 1 : (type[1].checked ? 2 : 3);
    var accept = document.querySelector('input[name="dateStartEnd"]').checked ? 2 : 1;
    query += 'keyword=' + encodeURIComponent(keyword) + '&date=' + encodeURIComponent(date) +
        '&type=' + encodeURIComponent(type) + '&acceptedOnly=' + encodeURIComponent(accept);

    xhr.open('GET', query, true);
    var token = localStorage.getItem('token');
    xhr.setRequestHeader('vlife-access-key', vLifeAccessKey);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('auth-token', token);

    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert(xhr.statusText + ": "+ xhr.responseText);
            return;
        }

        document.querySelector('.findEvents').innerHTML = xhr.responseText;
    };
    xhr.onerror = function() {
        alert( xhr.statusText + ": "+ xhr.responseText );
    };

    xhr.send();
    return false;
};

//

