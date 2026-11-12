/* samco-core · api.js · v1.0
   Gọi Apps Script. Mỗi app khai báo window.API_URL (link /exec) trước khi nạp file này. */
async function call(fn, ...args) {
  let res;
  try {
    // text/plain để tránh yêu cầu kiểm tra CORS
    res = await fetch(window.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn, args }),
      redirect: 'follow',
      credentials: 'omit'
    });
  } catch (e) { throw 'Không kết nối được. Vui lòng thử lại.'; }
  let j;
  try { j = await res.json(); } catch (e) { throw 'Hệ thống đang bận. Vui lòng thử lại sau.'; }
  if (!j.ok) throw j.error;
  return j.data;
}
