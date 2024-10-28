export const datetimeToString = (datetime: Date) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = datetime.getFullYear();
    const month = months[datetime.getMonth()];
    const date = String(datetime.getDate()).padStart(2, '0')
    const hour = String(datetime.getHours()).padStart(2, '0')
    const min = String(datetime.getMinutes()).padStart(2, '0')
    const sec = String(datetime.getSeconds()).padStart(2, '0')
    return date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
}

export const millisecondsToDHM = (milliseconds: number) => {
    return {
        minutes  : Math.floor( milliseconds /    60000 %   60 ),
        hours  : Math.floor( milliseconds /  3600000 %   24 ),
        days  : Math.floor( milliseconds / 86400000        ),
    };
}