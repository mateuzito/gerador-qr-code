document.addEventListener("DOMContentLoaded", () => {
  const readBtn = document.getElementById("read-btn");
  const fileInput = document.getElementById("file-input");
  const fileName = document.getElementById("file-name");
  const resultSpan = document.querySelector("#result span");
  const wrapper = document.querySelector(".wrapper");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");

  // Mostrar ícone de limpar quando um arquivo é selecionado
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileName.textContent = `${fileInput.files[0].name}`;
      clearBtn.style.display = "inline";
    } else {
      fileName.textContent = "";
      clearBtn.style.display = "none";
    }
  });

  // Lógica de leitura de QR Code
  readBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Por favor, selecione uma imagem PNG ou JPG.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/read-qr-code/`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      const decodedText = result[0].symbol[0].data;
      resultSpan.textContent =
        decodedText || "Nenhum dado encontrado no QR Code.";
      copyBtn.style.display = decodedText ? "inline" : "none";
    } catch (error) {
      console.error("Erro ao ler o QR Code:", error);
      alert("Não foi possível ler o QR Code. Tente novamente.");
    }
  });

  // Lógica de cópiar o texto
  copyBtn.addEventListener("click", () => {
    const textToCopy = resultSpan.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("Conteúdo copiado para a área de transferência!");
        })
        .catch((err) => {
          console.error("Erro ao copiar o texto: ", err);
        });
    } else {
      // Fallback para dispositivos que não suportam navigator.clipboard
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Conteúdo copiado para a área de transferência!");
      } catch (err) {
        console.error("Erro ao copiar o texto: ", err);
      }
      document.body.removeChild(textArea);
    }
  });

  // Lógica de limpar o conteúdo
  clearBtn.addEventListener("click", () => {
    fileInput.value = "";
    fileName.textContent = "";
    resultSpan.textContent = "";
    copyBtn.style.display = "none";
    clearBtn.style.display = "none";
  });
});
