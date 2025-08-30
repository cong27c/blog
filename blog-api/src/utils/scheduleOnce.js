const activeTasks = {};

function scheduleOnce(name, date, handler) {
  if (activeTasks[name]) {
    return console.log(`Task ${name} already exists, cancelled`);
  }

  const now = Date.now();
  const runAt = new Date(date).getTime();
  const delay = runAt - now;

  if (delay <= 0) {
    console.log(`⏩ ${name} chạy ngay vì thời gian <= hiện tại`);
    return handler();
  }

  const timeoutId = setTimeout(async () => {
    try {
      await handler();
      console.log(`✅ Task ${name} executed at ${date}`);
    } catch (error) {
      console.error(error);
    } finally {
      delete activeTasks[name]; // xoá sau khi chạy 1 lần
    }
  }, delay);

  activeTasks[name] = timeoutId;
}

module.exports = scheduleOnce;
