var formInput = document.forms[0];

formInput.onsubmit = function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    var body = {
        password: formInput.elements[1].value,
        email: formInput.elements[0].value
    };
    var query = 'http://vlife.lastshelter.net:1337/api/v1/user/login';

    xhr.open('POST', query, true);
    xhr.setRequestHeader('vlife-access-key', vLifeAccessKey);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        var token = xhr.responseText;
        alert(token);

        token = JSON.parse(token);
        token = token.data.token.value;
        localStorage.setItem('token', JSON.stringify(token));
    };

    xhr.onerror = function() {
        alert( xhr.statusText + ": "+ xhr.responseText );
    };

    xhr.send(JSON.stringify(body));
    return false;
};