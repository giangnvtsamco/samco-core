/* samco-core · ui.js · v1.1
   Hàm giao diện dùng chung: thông báo, định dạng, chống chèn mã, bỏ dấu, ảnh, file. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* Chống chèn mã: luôn esc() dữ liệu trước khi đưa vào innerHTML */
function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* Thông báo ngắn */
let _toastT;
function toast(msg, bad) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg; el.classList.toggle('bad', !!bad); el.hidden = false;
  clearTimeout(_toastT); _toastT = setTimeout(() => { el.hidden = true; }, bad ? 4200 : 2400);
}

/* Định dạng */
function money(n) { n = Number(n); return isFinite(n) && n ? n.toLocaleString('vi-VN') + ' đ' : '—'; }
function num(n) { n = Number(n); return isFinite(n) ? n.toLocaleString('vi-VN') : ''; }
/* Bỏ dấu, viết thường, gọn khoảng trắng — dùng để so tên */
function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

/* Nút đang chạy: khóa nút, đổi chữ, chạy xong trả lại */
async function busy(btn, text, fn) {
  const old = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin"></span>' + esc(text || '');
  try { return await fn(); } finally { btn.disabled = false; btn.innerHTML = old; }
}

/* Đọc file thành base64 (không kèm tiền tố data:) */
function fileToBase64(file) {
  return new Promise((ok, no) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(',')[1]);
    r.onerror = () => no('Không đọc được file.');
    r.readAsDataURL(file);
  });
}

/* Thu nhỏ ảnh chụp trước khi gửi (cạnh dài tối đa max px, JPEG) → base64 */
function shrinkImage(file, max = 1600, q = 0.82) {
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      ok(c.toDataURL('image/jpeg', q).split(',')[1]);
    };
    img.onerror = () => no('Không đọc được ảnh.');
    img.src = url;
  });
}

/* Sao chép chữ */
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); }
  catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  toast('Đã sao chép');
}

/* Lưu tạm trên máy — luôn bọc try/catch (chế độ riêng tư có thể chặn) */
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

/* Chân trang: tên app · phiên bản · bản quyền. Tự báo khi có bản mới (đọc version.json của app). */
function appFoot(name, ver, box) {
  const f = box || document.body.appendChild(document.createElement('footer'));
  f.classList.add('app-foot');
  f.innerHTML = esc(name) + ' · phiên bản ' + esc(ver) + '<br>© ' + new Date().getFullYear() + ' VinFast SAMCO Bình Tân · Lưu hành nội bộ';
  const check = () => fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => {
    if (!j || !j.v || j.v === ver || document.querySelector('.upd-bar')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'upd-bar'; b.textContent = 'Đã có bản mới · bấm để tải lại';
    b.onclick = () => location.reload(); document.body.appendChild(b);
  }).catch(() => {});
  check();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
}
