// ButtonTambah.js
export default function ButtonTambah({ text, onClick }) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = 'btn btn-primary'; // gunakan CSS Bootstrap jika tersedia
  btn.style.padding = '8px 12px';
  btn.style.fontSize = '14px';
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', onClick);
  return btn;
}
