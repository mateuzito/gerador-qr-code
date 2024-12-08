const wrapper = document.querySelector(".wrapper"),
  qrInput = wrapper.querySelector(".form input"),
  generateBtn = wrapper.querySelector(".form button"),
  qrImg = wrapper.querySelector(".qr-code img"),
  downloadBtn = document.getElementById("download-btn");
let preValue;

generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value.trim();
  if (!qrValue || preValue === qrValue) return;
  preValue = qrValue;
  generateBtn.innerText = "Gerando QR Code...";
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
  qrImg.addEventListener("load", () => {
    wrapper.classList.add("active");
    generateBtn.innerText = "Gerar QR Code";

    downloadBtn.style.display = "inline-block";
  });
});

let downloadCounter = 1;
let lastDownloadDate = "";

downloadBtn.addEventListener("click", () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  const today = `${day}-${month}-${year}`;

  if (today !== lastDownloadDate) {
    downloadCounter = 1;
    lastDownloadDate = today;
  }

  fetch(qrImg.src)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const fileName = `qrcode${downloadCounter}_${today}.png`;

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      downloadCounter++;
    })
    .catch((err) => console.error("Erro ao baixar o Qr Code", err));
});

qrInput.addEventListener("keyup", () => {
  if (!qrInput.value.trim()) {
    wrapper.classList.remove("active");
    preValue = "";
    downloadBtn.style.display = "none";
  }
});
