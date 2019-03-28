const available_wid = require('../config/about.json')

const get_widget_list = function (user_list) {
    let server_list = available_wid
    let d_wid = [];
    if (user_list == undefined)
        return [];
    user_list.widgets.forEach(u_widget => {
        let ind = server_list.find(service => {
            return service.name == u_widget.service
        })
        let widget;
        if (ind) {
            widget = ind.widgets.find(wid => {
                return u_widget.name == wid.name
            })
            if (widget)
                d_wid.push({
                    u_widget,
                    widget
                })
        }
    });
    return (d_wid)
}

const find_widget = function (service, name) {
    fservice = available_wid.find(serv => serv.name == service)
    if (fservice == undefined)
        return undefined;
    else {
        widget = fservice.widgets.find(wid => wid.name == name)
        widget.service = fservice.name
        return widget
    }
}

const isWidgetHere = function (name, list) {
    try {
        widget = list.find(wid => wid.name == name)
        return widget ? true : false
    } catch (e) {
        return false;
    }
}

module.exports = {
    get_widget_list,
    find_widget,
    isWidgetHere
}