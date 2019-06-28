(() => {
  function update(id = '', start = {}) {
    const dom = document.querySelector(id);
    const ts = new Date(start.year, start.month - 1, start.day).getTime();

    return () => {
      let offset = parseInt((new Date().getTime() - ts) / 1000, 10)
      
      if(offset < 0) {
        dom.innerHTML = "0일0시0분0초";
        return;
      }

      let day = Math.floor(offset / 86400),
        hour = Math.floor((offset % 86400) / 3600),
        minute = Math.floor(((offset % 86400) % 3600) / 60),
        second = Math.floor(((offset % 86400) % 3600) % 60);

      dom.innerHTML = day + "일 " + hour + "시 " + minute + "분 " + second + "초";
    };
  }

  const { start_time } = window.AD_CONFIG;
  const [startYear, startMonth, startDay] = start_time.split('-');
  const startTime = {
    year: parseInt(startYear, 10),
    month: parseInt(startMonth, 10),
    day: parseInt(startDay, 10)
  };

  isNaN(startTime.year) && (startTime.year = 2018);
  isNaN(startTime.month) && (startTime.month = 2);
  isNaN(startTime.day) && (startTime.day = 10);

  const timeUpdate = update('#site-time', startTime);
  timeUpdate();
  setInterval(timeUpdate, 1000);
})();