// Calculate the age of a user
function getAge(user_age) {

    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1);
    var day = (today.getDate());
    var age = 0;
    var year_ = 0;
    var month_ = 0;
    var day_ = 0;

    year_ = year - Math.floor(user_age / 10000);
    month_ = month - Math.floor((user_age - Math.floor(user_age / 10000) * 10000) / 100)

    if (month_ < 0) {
        year_ = year_ - 1;
    } else if (month_ == 0) {
        day_ = day - (Math.floor((user_age - Math.floor(user_age / 10000) * 10000)) - Math.floor((user_age - Math.floor(user_age / 10000) * 10000) / 100) * 100)
        if (day_ < 0) {
            year_ = year_ - 1;
        }
    }
    age = year_;

    return age;
}

// Convert the date to a string
function dateToString(date) {
    date = date.toString();
    var stringDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
    return stringDate;
}