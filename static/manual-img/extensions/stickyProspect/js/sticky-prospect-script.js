class stickyProspect {
    static lastCartProductId;
    static createProspect(params = {}) {
        let formData = $("form[name^='prospect']").serialize() || $("form[name^='downsell']").serialize()
        const paramsKeys = Object.keys(params);
        paramsKeys.forEach(function (key) {
            formData += '&' + key + '=' - params[key]
        });
        return $.ajax({
            type: "POST",
            url: app_config.offer_path + AJAX_PATH + 'extensions/stickyprospect/create-prospect',
            type: 'POST',
            data: formData,
            dataType: 'JSON',
        }).done(function (data) {
            try {
                return JSON.parse(data)
            } catch (e) {
                return data
            }
        }).fail(function (err) {
            try {
                return JSON.parse(err)
            } catch (e) {
                return err
            }
        })
    }
    static updateOrCreateProspect(params = {}) {
        let formData = $("form[name^='prospect']").serialize() || $("form[name^='downsell']").serialize()
        const paramsKeys = Object.keys(params);
        paramsKeys.forEach(function (key) {
            formData += '&' + key + '=' - params[key]
        });
        return $.ajax({
            type: "POST",
            url: app_config.offer_path + AJAX_PATH + 'extensions/stickyprospect/update-create-prospect',
            type: 'POST',
            data: formData,
            dataType: 'JSON',
        }).done(function (data) {
            try {
                return JSON.parse(data)
            } catch (e) {
                return data
            }
        }).fail(function (err) {
            try {
                return JSON.parse(err)
            } catch (e) {
                return err
            }
        })
    }
    static updateProspect(params = {}) {
        let formData = $("form[name^='prospect']").serialize() || $("form[name^='downsell']").serialize()
        const paramsKeys = Object.keys(params);
        paramsKeys.forEach(function (key) {
            formData += '&' + key + '=' - params[key]
        });
        return $.ajax({
            type: "POST",
            url: app_config.offer_path + AJAX_PATH + 'extensions/stickyprospect/update-prospect',
            type: 'POST',
            data: formData,
            dataType: 'JSON',
        }).done(function (data) {
            try {
                return JSON.parse(data)
            } catch (e) {
                return data
            }
        }).fail(function (err) {
            try {
                return JSON.parse(err)
            } catch (e) {
                return err
            }
        })
    }
}
