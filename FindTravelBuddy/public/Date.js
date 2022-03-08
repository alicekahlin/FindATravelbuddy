// Convert a date to numbers
function dateToInt(date) {
    var values = date.split("-"); 
    var year = parseInt(values[0]);
    var month = parseInt(values[1]);
    var totalStartdate = year*100 + month;
    
    if(values.length === 3){
        var day = parseInt(values[2]);
        totalStartdate = totalStartdate*100 + day;
    }

    return totalStartdate;
} 
