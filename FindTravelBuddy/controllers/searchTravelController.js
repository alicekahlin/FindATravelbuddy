const User = require('../models/User')
const Traveladd = require('../models/traveladd');

module.exports.display_get = (req, res) => {
    res.render('search/searchtravel', { title: 'Find Travel' });
};


function dateToInt(date) {
    var values = date.split("-");
    var year = parseInt(values[0]);
    var month = parseInt(values[1]);
    var totalStartdate = year * 100 + month;

    if (values.length === 3) {
        var day = parseInt(values[2]);
        totalStartdate = totalStartdate * 100 + day;
    }

    return totalStartdate;
}

module.exports.buget_get = (req, res) => {
    var { minBudget, maxBudget, startdate, enddate, country } = req.query;
    const { gender, checkBoxCountry } = req.query;
    const FUTURE = 210001;
    const BACK_IN_TIME = 202105;
    const BUDGETMIN = 0;
    const BUDGETMAX = 10000;

    if (checkBoxCountry == "on") {
        country = "";
    }

    var obj = {

    }

    if (minBudget != "") {
        obj.minBudget = minBudget;
    } else {
        obj.minBudget = BUDGETMIN;
    }

    if (maxBudget != "") {
        obj.maxBudget = maxBudget;
    } else {
        obj.maxBudget = BUDGETMAX;
    }

    if (startdate != "") {
        var startDate = dateToInt(startdate);
        obj.startdate = startDate;

    } else {
        obj.startdate = BACK_IN_TIME;
    }

    if (enddate != "") {
        var endDate = dateToInt(enddate);
        obj.enddate = endDate;

    } else {
        obj.enddate = FUTURE;
    }

    var searchFactor;

    searchFactor = { minbudget: { $gte: obj.minBudget }, maxbudget: { $lte: obj.maxBudget }, startdate: { $gte: obj.startdate }, enddate: { $lte: obj.enddate } };

    if (country != "") {
        searchFactor.destination = country;
    }

    if (gender != undefined) {
        searchFactor.creatorGender = gender;
    }

    Traveladd.find(searchFactor)
        .then((traveladd) => {
            res.render('search/trips', { title: "Sökning done", traveladds: traveladd });
        })
        .catch(err => console.log(err));


};