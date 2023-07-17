var dev_mode = app_config.dev_mode;
var addressFinder;
var addressSelect;
var oldAddressSelectVal;
var selector;
var components, street_address, address, city, state, country, availableCountry, postal_code;
var availableStates, candidateStates = [];
var oldAddressSelectValName;

function stateFilter(candidateStates, states) {
    var state_short_name = '';
    $.each(states, function (key, value) {
        for (var ii = 0; ii < candidateStates.length; ii++) {
            var p = new RegExp("\\b^" + candidateStates[ii] + "\\b");
            if (p.test(value['name'])) {
                state_short_name = key;
                break;
            }

            var p1 = new RegExp("\\b" + value['name'] + "\\b");
            if (p1.test(candidateStates[ii])) {
                state_short_name = key;
                break;
            }
        }
    });
    if (state_short_name !== '') {
        return state_short_name;
    }
    $.each(states, function (key, value) {
        for (var ii = 0; ii < candidateStates.length; ii++) {
            var candidateState = candidateStates[ii].replace(/^county\s+/i, '');
            var p = new RegExp("\\b" + candidateState + "\\b");
            if (p.test(value['name'])) {
                state_short_name = key;
                break;
            }
        }

    });

    return state_short_name;
}

function checkMasking(prefix) {
    if (typeof validator_data != 'undefined' && validator_data.hasOwnProperty('enable_ca_statecode_validation')) {
        var c_code = $("[name=" + prefix + "Country]").val();
        if (c_code == '')
        {
            c_code = $("[name=shippingCountry]").val();
        }
        var c_code_mask = validator_data[c_code.toLowerCase() + '_state_code_mask'];
        if (c_code_mask) {
            $('input[name=' + prefix + 'Zip]').mask(validator_data[c_code.toLowerCase() + '_state_code_mask']);
        } else {
            $('input[name=' + prefix + 'Zip]').unmask();
        }
    }
}

function fillInAddress() {
    var place = addressFinder.getPlace();
    arrangeAddress(place);
}

function arrangeAddress(place) {
    var prefix = addressSelect.attr('name').replace(/Address1$/, '');
    if (dev_mode == "Y") {
        console.log(place);
    }
    if (place.name == addressSelect.val() && (!place.address_components.length || !place.formatted_address)) {
        return;
    }
    components = place.address_components;
    var citySelected = false;
    var stateSelected = false;
    var street_address = '';
    var address = '';
    components = components.reverse();
    candidateStates = [];
    for (var i in components) {
        if (
                components[i].types.indexOf('street_number') !== -1
                ) {
            console.log(components[i]);
            street_address = components[i].long_name;
        }
        if (
                components[i].types.indexOf('route') !== -1
                ) {
            address = components[i].long_name;
        }
        if (
                components[i].types.indexOf('locality') !== -1 ||
                components[i].types.indexOf('sublocality') !== -1
                ) {
            city = components[i].long_name;
            citySelected = true;
        } else if (components[i].types.indexOf('postal_town') !== -1 && !citySelected) {
            city = components[i].long_name;
            citySelected = true;
        } else if (
                components[i].types.indexOf('administrative_area_level_2') !== -1 &&
                components[i].types.indexOf('political') !== -1 && !citySelected
                ) {
            city = components[i].long_name;
            citySelected = true;
        } else if (
                components[i].types.indexOf('administrative_area_level_1') !== -1 && !citySelected
                ) {
            city = components[i].long_name;
        }

        if (
                components[i].types.indexOf('administrative_area_level_1') !== -1 && !stateSelected
                ) {
            candidateStates.push(components[i].long_name);
            stateSelected = true;
        }
        if (components[i].types.indexOf('administrative_area_level_2') !== -1 && !stateSelected) {
            candidateStates.push(components[i].long_name);
            stateSelected = true;
        }
        if (
                components[i].types.indexOf('political') !== -1 &&
                components[i].types.indexOf('country') === -1 &&
                !stateSelected
                ) {
            candidateStates.push(components[i].long_name);
            stateSelected = true;
        }
        if (components[i].types.indexOf('postal_code') !== -1) {
            postal_code = components[i].long_name;
        }
        if (components[i].types.indexOf('country') !== -1) {
            country = components[i].short_name;
        }
    }
    availableCountry = (app_config.allowed_country_codes.indexOf(country) > -1);
    if (availableCountry == false) {
        return;
    }
    availableStates = app_config.countries[country]['states'];
    selectedState = stateFilter(candidateStates, availableStates);
    if (dev_mode == "Y") {
        console.log(street_address + "," + address + city + ',' + selectedState + ',' + country + postal_code);
    }

    if (street_address == '' && address == '')
    {
        full_street_address = city;
    }

    if (street_address == '' && address != '') {
       full_street_address = addressSelect.val().split(',')[0];
    }

    else {
       full_street_address = street_address + " " + address;
    }

    addressSelect.val(full_street_address);

    $("[name=" + prefix + "Zip]").val(postal_code);

    $("[name=" + prefix + "City]").val(city);
    $("[name=" + prefix + "City]").trigger('blur');
    $("[name=" + prefix + "Country]").val(country).change();

    var timmer = setTimeout(function () {
        if ($("[name=state] option, [name=" + prefix + "State] option").length) {
            if (selectedState !== '') {
                $("[name=state], [name=" + prefix + "State]").val(selectedState);
                $("[name=state], [name=" + prefix + "State]").trigger('blur');
            }
            else {
                selectedState = stateFilter([city], availableStates);
                $("[name=state], [name=" + prefix + "State]").val(selectedState);
                $("[name=state], [name=" + prefix + "State]").trigger('blur');
            }
        } else if ($("[name=state] [type=text], [name=" + prefix + "State] [type=text]").length) {
            if (selectedState !== '') {
                $("[name=state], [name=" + prefix + "State]").val(selectedState);
                $("[name=state], [name=" + prefix + "State]").trigger('blur');
            }
            else {
                selectedState = stateFilter([city], availableStates);
                $("[name=state], [name=" + prefix + "State]").val(selectedState);
                $("[name=state], [name=" + prefix + "State]").trigger('blur');
            }
        }
    }, 500);
    checkMasking(prefix);
}

function attachListener() {
    addressSelect = $('input[name$=Address1]');
    if ($('input[name$=Address1]').val() == '')
    {
        addressSelect = $('input[name=shippingAddress1]');
    }
    
    if (typeof google != 'undefined' && addressSelect.length != '') {
        addressFinder = new google.maps.places.Autocomplete(addressSelect[0], {'types': ['address']});
        if (restricted_countries)
        {
            addressFinder.setComponentRestrictions(
                    {'country': restricted_countries.split(',')}
            );
        }

        addressFinder.addListener('place_changed', fillInAddress);
    } else if(addressSelect.length == '') {
        console.log("No Address input field");
    } else {
        console.log("Google API has not been loaded");
    }
}
;

window.gm_authFailure = function () {
    setTimeout(function () {
        var isDisabled = $('input[name$=Address1]').attr('disabled');
        if (typeof isDisabled != 'undefined')
        {
            $('input[name$=Address1]').attr('disabled', false);
            $('input[name$=Address1]').removeAttr('style');
            $('input[name$=Address1]').attr('placeholder', 'Your Address');
            $('input[name$=Address1]').removeClass('gm-err-autocomplete');
        }
        console.log('General Error with Google Api key ');
    }, 1000);
    return false;
}

$('body').keyup(function (e) {
    var code = e.keyCode || e.which;
    var addressPrevVal = '';
    if(oldAddressSelectValName != '' && typeof(oldAddressSelectValName) != 'undefined') {
        if ($("input[name="+oldAddressSelectValName+"]").val() != '' && $("input[name="+oldAddressSelectValName+"]").val() != 'undefined')
        {
            addressPrevVal = $("input[name="+oldAddressSelectValName+"]").val();
        }
        else {
            addressPrevVal = (typeof oldAddressSelectVal != 'undefined') ? oldAddressSelectVal : '';
            console.log('old value:', addressPrevVal);
        }

        if (code == '9') {
            $("input[name="+oldAddressSelectValName+"]").val(addressPrevVal);
        }
    }    
});


$('input[name$=Address1]').keyup(function (e) {
    oldAddressSelectVal = $('input[name$=Address1]').val();
    var selectedAttr = $(this).attr('name');
    oldAddressSelectValName = $('input[name$=Address1]').attr('name');
    if (selectedAttr === 'billingAddress1')
    {
        addressSelect = $('input[name=billingAddress1]');
        if (typeof google != 'undefined') {
            var autocomplete2 = new google.maps.places.Autocomplete(addressSelect[0], {'types': ['address']});
            if (restricted_countries)
            {
                autocomplete2.setComponentRestrictions(
                        {'country': restricted_countries.split(',')}
                );
            }
            google.maps.event.addListener(autocomplete2, 'place_changed', function () {
                var place = autocomplete2.getPlace();
                if (typeof place != "undefined") {
                    arrangeAddress(place);
                }
                else {
                    console.log("Place not found");
                }
            });
        } else {
            console.log("Google API has not been loaded");
        }

    }
    else {
        addressSelect = $('input[name=shippingAddress1]');
    }

});