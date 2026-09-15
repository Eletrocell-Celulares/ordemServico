document.addEventListener("DOMContentLoaded", () => {
    const hoje = new Date().toISOString().split('T')[0];
    const inputDataEntrada = document.getElementById("dataEntrada");
    const inputDataPrevisao = document.getElementById("dataPrevisao");

    if (inputDataEntrada && !inputDataEntrada.value) {
        inputDataEntrada.value = hoje;
    }
    if (inputDataPrevisao && !inputDataPrevisao.value) {
        const previsao = new Date();
        previsao.setDate(previsao.getDate() + 3);
        inputDataPrevisao.value = previsao.toISOString().split('T')[0];
    }

    const itensChecklist = [
        "Display / Imagem",
        "Touch Screen",
        "Câmera Traseira",
        "Câmera Frontal",
        "Flash Traseiro",
        "Conector de Carga",
        "Face ID",
        "Touch ID",
        "Áudio / Alto-falantes",
        "Microfone",
        "Wi-Fi / Rede Celular",
        "Bluetooth",
        "Sensor de Proximidade",
        "True Tone",
        "Botões Físicos"
    ];

    const containerChecklist = document.getElementById("checklistContainer");
    if (containerChecklist) {
        const headerHTML = containerChecklist.querySelector('.checklist-header-row').outerHTML;
        containerChecklist.innerHTML = headerHTML;

        itensChecklist.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "checklist-item-row";
            row.innerHTML = `
                <span>${item}</span>
                <span><input type="checkbox" class="check-ok" data-item="${item}" id="chk-ok-${index}"></span>
                <span><input type="checkbox" class="check-defeito" data-item="${item}" id="chk-def-${index}"></span>
                <span><input type="checkbox" class="check-nt" data-item="${item}" id="chk-nt-${index}"></span>
            `;
            containerChecklist.appendChild(row);

            const chkOk = row.querySelector('.check-ok');
            const chkDef = row.querySelector('.check-defeito');
            const chkNt = row.querySelector('.check-nt');

            // Exclusividade mútua entre as 3 caixinhas
            chkOk.addEventListener('change', () => {
                if (chkOk.checked) {
                    chkDef.checked = false;
                    chkNt.checked = false;
                }
            });
            chkDef.addEventListener('change', () => {
                if (chkDef.checked) {
                    chkOk.checked = false;
                    chkNt.checked = false;
                }
            });
            chkNt.addEventListener('change', () => {
                if (chkNt.checked) {
                    chkOk.checked = false;
                    chkDef.checked = false;
                }
            });
        });
    }

    function coletarDadosOs() {
        const os = document.getElementById("val-os")?.value || "N/A";
        const dataEntrada = document.getElementById("dataEntrada")?.value || "N/A";
        const atendente = document.getElementById("val-atendente")?.value || "N/A";
        const dataPrevisao = document.getElementById("dataPrevisao")?.value || "N/A";
        
        const cliente = document.getElementById("val-cliente")?.value || "N/A";
        const telefone = document.getElementById("val-telefone")?.value || "N/A";
        const cpf = document.getElementById("val-cpf")?.value || "N/A";
        
        const modelo = document.getElementById("val-modelo")?.value || "N/A";
        const cor = document.getElementById("val-cor")?.value || "N/A";
        const imei = document.getElementById("val-imei")?.value || "N/A";
        const senha = document.getElementById("val-senha")?.value || "N/A";
        const icloud = document.getElementById("val-icloud")?.value || "Não informado";
        
        const bateria = document.getElementById("val-bateria")?.value || "N/A";
        const acessorios = document.getElementById("val-acessorios")?.value || "N/A";
        const avarias = document.getElementById("val-avarias")?.value || "Nenhum";
        const defeito = document.getElementById("val-defeito")?.value || "N/A";
        
        const total = document.getElementById("val-total")?.value || "N/A";
        const sinal = document.getElementById("val-sinal")?.value || "N/A";
        const restante = document.getElementById("val-restante")?.value || "N/A";

        let oks = [];
        let defeitos = [];
        let naoTestados = [];

        document.querySelectorAll('.checklist-item-row').forEach(row => {
            const nomeItem = row.querySelector('span').textContent;
            const chkOk = row.querySelector('.check-ok').checked;
            const chkDef = row.querySelector('.check-defeito').checked;
            const chkNt = row.querySelector('.check-nt').checked;

            if (chkOk) oks.push(nomeItem);
            if (chkDef) defeitos.push(nomeItem);
            if (chkNt) naoTestados.push(nomeItem);
        });

        return {
            os, dataEntrada, atendente, dataPrevisao,
            cliente, telefone, cpf,
            modelo, cor, imei, senha, icloud,
            bateria, acessorios, avarias, defeito,
            total, sinal, restante,
            oks, defeitos, naoTestados
        };
    }

    function formatarData(dataStr) {
        if (!dataStr || dataStr === "N/A") return "N/A";
        const partes = dataStr.split("-");
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataStr;
    }

    function gerarTextoMensagem(d) {
        let textoOks = d.oks.length > 0 ? d.oks.join(", ") : "Nenhum";
        let textoDefeitos = d.defeitos.length > 0 ? d.defeitos.join(", ") : "Nenhum";
        let textoNt = d.naoTestados.length > 0 ? d.naoTestados.join(", ") : "Nenhum";

        return `*ELETROCELL ⚡️ — ORDEM DE SERVIÇO*
-----------------------------------
*OS Nº:* ${d.os}
*Data de Entrada:* ${formatarData(d.dataEntrada)}
*Atendente:* ${d.atendente}
*Previsão de Término:* ${formatarData(d.dataPrevisao)}

*1. DADOS DO CLIENTE*
*Nome:* ${d.cliente}
*Telefone:* ${d.telefone}
*CPF:* ${d.cpf}

*2. DADOS DO APARELHO*
*Modelo:* ${d.modelo} | *Cor:* ${d.cor}
*IMEI/Série:* ${d.imei}
*Senha:* ${d.senha}
*iCloud:* ${d.icloud}

*3. CHECKLIST DE BALCÃO*
✅ *OK:* ${textoOks}
❌ *Defeito:* ${textoDefeitos}
⚠️ *Não Testável (Apagado/Sem Acesso):* ${textoNt}

🔋 *Bateria:* ${d.bateria} | *Acessórios:* ${d.acessorios}
🔍 *Avarias:* ${d.avarias}

*4. DEFEITO RELATADO*
${d.defeito}

*5. VALORES*
*Total:* ${d.total} | *Sinal:* ${d.sinal} | *Restante:* ${d.restante}

-----------------------------------
_Av. Getúlio Vargas, n°40, Conceição do Jacuípe - BA_
_WhatsApp: (75) 98171-8671_`;
    }

    const btnGerarPreview = document.getElementById("btnGerarPreview");
    const osDocumento = document.getElementById("osDocumento");
    const previewContainer = document.getElementById("previewContainer");
    const previewContent = document.getElementById("previewContent");
    const btnContainerPrincipal = document.getElementById("btnContainerPrincipal");

    if (btnGerarPreview) {
        btnGerarPreview.addEventListener("click", () => {
            const dados = coletarDadosOs();
            previewContent.textContent = gerarTextoMensagem(dados);
            
            osDocumento.style.display = "none";
            btnContainerPrincipal.style.display = "none";
            previewContainer.style.display = "flex";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const btnVoltarEditar = document.getElementById("btnVoltarEditar");
    if (btnVoltarEditar) {
        btnVoltarEditar.addEventListener("click", () => {
            previewContainer.style.display = "none";
            osDocumento.style.display = "block";
            btnContainerPrincipal.style.display = "flex";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const btnEnviarWhatsapp = document.getElementById("btnEnviarWhatsapp");
    if (btnEnviarWhatsapp) {
        btnEnviarWhatsapp.addEventListener("click", () => {
            const dados = coletarDadosOs();
            const texto = gerarTextoMensagem(dados);
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
            window.open(url, '_blank');
        });
    }

    const btnCopiarPreview = document.getElementById("btnCopiarPreview");
    if (btnCopiarPreview) {
        btnCopiarPreview.addEventListener("click", () => {
            const dados = coletarDadosOs();
            const texto = gerarTextoMensagem(dados);
            navigator.clipboard.writeText(texto).then(() => {
                alert("Ordem de serviço copiada com sucesso!");
            });
        });
    }

    const btnGerarPdf = document.getElementById("btnGerarPdf");
    if (btnGerarPdf) {
        btnGerarPdf.addEventListener("click", () => {
            window.print();
        });
    }

    const btnLimparOs = document.getElementById("btnLimparOs");
    if (btnLimparOs) {
        btnLimparOs.addEventListener("click", () => {
            if (confirm("Deseja limpar todos os campos para iniciar uma nova O.S.?")) {
                document.querySelectorAll("input[type='text'], textarea").forEach(el => el.value = "");
                document.querySelectorAll("input[type='checkbox']").forEach(el => el.checked = false);
                if (inputDataEntrada) inputDataEntrada.value = hoje;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});
