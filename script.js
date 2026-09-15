document.addEventListener("DOMContentLoaded", () => {
    const osDocumento = document.getElementById("osDocumento");
    const previewContainer = document.getElementById("previewContainer");
    const previewContent = document.getElementById("previewContent");
    const btnGerarPreview = document.getElementById("btnGerarPreview");
    const btnVoltarEditar = document.getElementById("btnVoltarEditar");
    const btnContainerPrincipal = document.getElementById("btnContainerPrincipal");
    const btnCopiarPreview = document.getElementById("btnCopiarPreview");
    const btnEnviarWhatsapp = document.getElementById("btnEnviarWhatsapp");
    const btnGerarPdf = document.getElementById("btnGerarPdf");
    const btnLimparOs = document.getElementById("btnLimparOs");

    // ---- SALVAMENTO AUTOMÁTICO (LOCALSTORAGE) ----
    const STORAGE_KEY = "eletrocell_os_dados_v1";

    function salvarDadosFormulario() {
        const dados = {};
        const campos = osDocumento.querySelectorAll("input, textarea");
        
        campos.forEach((input, index) => {
            const key = input.id || `campo_${index}`;
            if (input.type === "checkbox") {
                dados[key] = input.checked;
            } else {
                dados[key] = input.value;
            }
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    }

    function carregarDadosSalvos() {
        const salvos = localStorage.getItem(STORAGE_KEY);
        if (salvos) {
            try {
                const dados = JSON.parse(salvos);
                const campos = osDocumento.querySelectorAll("input, textarea");
                
                campos.forEach((input, index) => {
                    const key = input.id || `campo_${index}`;
                    if (dados[key] !== undefined) {
                        if (input.type === "checkbox") {
                            input.checked = dados[key];
                        } else {
                            input.value = dados[key];
                        }
                    }
                });
            } catch (e) {
                console.error("Erro ao carregar dados salvos:", e);
            }
        } else {
            const inputDataEntrada = document.getElementById("dataEntrada");
            if (inputDataEntrada && !inputDataEntrada.value) {
                inputDataEntrada.value = new Date().toISOString().split('T')[0];
            }
        }
    }

    osDocumento.addEventListener("input", salvarDadosFormulario);
    osDocumento.addEventListener("change", salvarDadosFormulario);

    carregarDadosSalvos();

    if (btnLimparOs) {
        btnLimparOs.addEventListener("click", () => {
            if (confirm("Deseja realmente limpar os dados e iniciar uma nova O.S.?")) {
                localStorage.removeItem(STORAGE_KEY);
                const campos = osDocumento.querySelectorAll("input, textarea");
                campos.forEach(input => {
                    if (input.type === "checkbox") {
                        input.checked = false;
                    } else {
                        input.value = "";
                    }
                });
                const inputDataEntrada = document.getElementById("dataEntrada");
                if (inputDataEntrada) {
                    inputDataEntrada.value = new Date().toISOString().split('T')[0];
                }
            }
        });
    }

    // ---- AGRUPADOR DE MENSAGENS ----
    const btnAdicionarMsg = document.getElementById("btnAdicionarMsg");
    const btnCopiarMsg = document.getElementById("btnCopiarMsg");
    const novaMensagemInput = document.getElementById("novaMensagem");
    const resultadoDiv = document.getElementById("resultado");

    let mensagensAgrupadas = [];

    if (btnAdicionarMsg) {
        btnAdicionarMsg.addEventListener("click", () => {
            const texto = novaMensagemInput.value.trim();
            if (texto !== "") {
                mensagensAgrupadas.push(texto);
                atualizarResultado();
                novaMensagemInput.value = "";
                novaMensagemInput.focus();
            }
        });
    }

    function atualizarResultado() {
        if (mensagensAgrupadas.length === 0) {
            resultadoDiv.textContent = "Nenhuma mensagem agrupada ainda...";
        } else {
            resultadoDiv.textContent = mensagensAgrupadas.join("\n\n");
        }
    }

    if (btnCopiarMsg) {
        btnCopiarMsg.addEventListener("click", () => {
            if (mensagensAgrupadas.length === 0) {
                alert("Não há mensagens para copiar!");
                return;
            }
            const textoParaCopiar = mensagensAgrupadas.join("\n\n");
            navigator.clipboard.writeText(textoParaCopiar).then(() => {
                btnCopiarMsg.textContent = "Copiado! ✓";
                setTimeout(() => {
                    btnCopiarMsg.textContent = "Copiar Bloco";
                }, 2000);
            }).catch(err => {
                console.error("Erro ao copiar: ", err);
            });
        });
    }

    // ---- PRÉ-VISUALIZAÇÃO E AÇÕES DA O.S. ----
    function gerarTextoOS() {
        let resumoOS = "📋 *ELETROCELL ⚡️ - ORDEM DE SERVIÇO* 📋\n\n";

        const campos = osDocumento.querySelectorAll("input, textarea");
        campos.forEach(input => {
            let labelText = "";
            if (input.previousElementSibling && input.previousElementSibling.tagName === "LABEL") {
                labelText = input.previousElementSibling.textContent;
            } else if (input.parentElement && input.parentElement.previousElementSibling && input.parentElement.previousElementSibling.tagName === "LABEL") {
                labelText = input.parentElement.previousElementSibling.textContent;
            } else if (input.parentElement && input.parentElement.tagName === "LABEL") {
                labelText = input.parentElement.textContent.trim();
            }

            if (input.type === "checkbox") {
                if (input.checked) {
                    resumoOS += `☑️ ${labelText}\n`;
                }
            } else if (input.value.trim() !== "") {
                if (labelText) {
                    resumoOS += `*${labelText}* ${input.value}\n`;
                }
            }
        });

        return resumoOS;
    }

    if (btnGerarPreview) {
        btnGerarPreview.addEventListener("click", () => {
            const textoFormatado = gerarTextoOS();
            previewContent.textContent = textoFormatado;

            osDocumento.style.display = "none";
            previewContainer.style.display = "block";
            btnContainerPrincipal.style.display = "none";
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnVoltarEditar) {
        btnVoltarEditar.addEventListener("click", () => {
            previewContainer.style.display = "none";
            osDocumento.style.display = "block";
            btnContainerPrincipal.style.display = "flex";
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnCopiarPreview) {
        btnCopiarPreview.addEventListener("click", () => {
            const textoParaCopiar = previewContent.textContent;
            navigator.clipboard.writeText(textoParaCopiar).then(() => {
                btnCopiarPreview.textContent = "Copiado! ✓";
                setTimeout(() => {
                    btnCopiarPreview.textContent = "Copiar Mensagem";
                }, 2000);
            }).catch(err => {
                console.error("Erro ao copiar O.S.: ", err);
            });
        });
    }

    if (btnEnviarWhatsapp) {
        btnEnviarWhatsapp.addEventListener("click", () => {
            const textoParaEnviar = encodeURIComponent(previewContent.textContent);
            
            const inputTelefone = document.getElementById("val-telefone");
            let numeroTel = "";
            if (inputTelefone && inputTelefone.value) {
                numeroTel = inputTelefone.value.replace(/\D/g, '');
            }

            let urlWhatsapp = "https://api.whatsapp.com/send?";
            if (numeroTel.length >= 10) {
                if (!numeroTel.startsWith("55")) {
                    numeroTel = "55" + numeroTel;
                }
                urlWhatsapp += `phone=${numeroTel}&`;
            }
            urlWhatsapp += `text=${textoParaEnviar}`;

            window.open(urlWhatsapp, '_blank');
        });
    }

    if (btnGerarPdf) {
        btnGerarPdf.addEventListener("click", () => {
            window.print();
        });
    }
});
