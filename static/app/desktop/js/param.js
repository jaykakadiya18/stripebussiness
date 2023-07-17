var discount_val = 0;
var flag = 0;
var discountTimes = 0;
var exit_val = 0;

if (app_query_params.discount) {
    if (app_query_params.discount == '5' || app_query_params.discount == '15' || app_query_params.discount == '20' || app_query_params.discount == '25') {
        discount_val = app_query_params.discount;
        flag = 1;
        discountTimes = 1;
    } else if (app_query_params.discount == '10') {
        discount_val = app_query_params.discount;
        discountTimes = 2;
        flag = 0;
    }
} else {
    discountTimes = '1';
    flag = 0;
}   

if (app_query_params.exit != '') {
     exit_val = app_query_params.exit;
    if (exit_val == 'n') {
        flag = 1;
    }
}

if(!app_query_params.package){
    app_query_params.package = 3;
}