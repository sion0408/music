// 公共方法
export const getCurrentTime = () => {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1; // 月份从0开始，因此需要加1
    const day = currentTime.getDate();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return `${year}年${month}月${day}:${hours}:${minutes}:${seconds}`

}
