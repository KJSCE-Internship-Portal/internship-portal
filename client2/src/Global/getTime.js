export function getCurrentIndianDateTime() {
    const currentDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false, // Use 24-hour format
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  
    return { date: currentDate, time: currentTime };
  }
  