
function ParseDateFromNow(date: Date) {
    const nowSec = Date.now() / 1000;
    const dateSec = date.getTime() / 1000;

    const secsPassed = (nowSec - dateSec); // Fixed to show past time correctly

    if (secsPassed < 60) {
        return `${Math.round(secsPassed)} secs ago`;
    }
    if (secsPassed < 60 * 60) {
        return `${Math.floor(secsPassed / (60))} mins ago`;
    } else if (secsPassed < 60 * 60 * 24) {
        return `${Math.floor(secsPassed / (60 * 60))} hrs ago`;
    } else if (secsPassed < 60 * 60 * 24 * 7) {
        return `${Math.floor(secsPassed / (60 * 60 * 24))} days ago`;
    } else {
        // Ensuring consistent formatting for date and time
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${hours}:${minutes}:${seconds} ${ampm}`;

        return `${month}-${day}-${year}, ${strTime}`;
    }
}

export default ParseDateFromNow