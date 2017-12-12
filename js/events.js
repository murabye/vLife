
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
