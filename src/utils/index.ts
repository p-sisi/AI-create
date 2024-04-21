//工具类函数封装

/*  
*   获取当前时间并将其转换为字符串格式"YYYY-MM-DD HH:mm:ss"
*/
export function getCurrentTime() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);
    
    var currentTimeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return currentTimeString;
}

/*  
*   将Data类型转化为字符串格式"YYYY-MM-DD HH:mm:ss"
*/
export function getStringTime(date: any) {
    var time = new Date(date);
    var year = time.getFullYear();
    var month = ('0' + (time.getMonth() + 1)).slice(-2);
    var day = ('0' + time.getDate()).slice(-2);
    var hours = ('0' + time.getHours()).slice(-2);
    var minutes = ('0' + time.getMinutes()).slice(-2);
    var seconds = ('0' + time.getSeconds()).slice(-2);
    
    var currentTimeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return currentTimeString;
};