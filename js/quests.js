var formPhone = document.forms[0];
var formReg = document.forms[1];

formPhone.onsubmit = function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    var phone = formPhone.elements[0].value;
    var query = 'http://vlife.lastshelter.net:1337/api/v1/user/checkPhone?phone=' +
        encodeURIComponent(phone) + '&noVerify=1';

    xhr.open('GET', query, true);
    xhr.setRequestHeader('vlife-access-key', vLifeAccessKey);

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.statusText + ": "+ xhr.responseText);
            return;
        }

        alert( 'Успех!' );
    };

    xhr.onerror = function() {
        alert( xhr.statusText + ": "+ xhr.responseText );
    };

    xhr.send();
    return false;
};
formReg.onsubmit = function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    var query = 'http://vlife.lastshelter.net:1337/api/v1/user/verifyPhone';
    var body = {
        phone: formPhone.elements[0].value,
        code: "0000"
    };

    xhr.open('POST', query, true);
    xhr.setRequestHeader('vlife-access-key', vLifeAccessKey);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.statusText + ": "+ xhr.responseText);
            return;
        }

        var securityKey = JSON.parse(xhr.responseText);
        securityKey = securityKey.data;
        securityKey = securityKey.security_key;

        var xhr2 = new XHR();
        query = 'http://vlife.lastshelter.net:1337/api/v1/user/signup';
        body = {
            name: formReg.elements[0].value,
            second_name: formReg.elements[1].value,
            email: formReg.elements[2].value,
            password: formReg.elements[3].value,
            avatar: 4,
            phone: formPhone.elements[0].value,
            security_key: securityKey
        };

        xhr2.open('POST', query, true);
        xhr2.setRequestHeader('vlife-access-key', vLifeAccessKey);
        xhr2.setRequestHeader('Content-Type', 'application/json');
        xhr2.onerror = function () {
            alert(xhr.statusText + ": "+ xhr.responseText);
        };
        xhr2.onload = function () {
            if (xhr2.status != 200) {
                alert(xhr.statusText + ": "+ xhr.responseText);
                return;
            }
            alert(xhr2.responseText);

            var token = JSON.parse(xhr2.responseText);
            token = token.data.token.value;
            localStorage.setItem('token', token);
        };

        xhr2.send(JSON.stringify(body));
    };
    xhr.onerror = function() {
        alert(xhr.statusText + ": "+ xhr.responseText);
    };

    xhr.send(JSON.stringify(body));
    return false;
};