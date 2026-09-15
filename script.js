// LISTA DE ITENS DO CHECKLIST
const checklistItems = [
    "Tela / Touchscreen",
    "Carregamento / Conector",
    "Câmera Traseira",
    "Câmera Frontal",
    "Microfone Principal",
    "Auricular (Ligação)",
    "Alto-falante (Som)",
    "Wi-Fi / Bluetooth",
    "Sinal de Chip / Rede",
    "Botões Volume / Power",
    "Biometria / Face ID",
    "Sensor de Proximidade",
    "Carcaça / Vidro Traseiro"
];

// RENDERIZAR CHECKLIST NA TELA
function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="checklist-header-row">
            <span>Item / Função</span>
            <span>OK</span>
            <span>Defeito</span>
            <span>N/T</span>
        </div>
    `;

    checklistItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'checklist-item-row';
        row.innerHTML = `
            <span>${item}</span>
            <input type="checkbox" name="chk_${index}" value="OK" onclick="uncheckOthers(this, 'chk_${index}')">
            <input type="checkbox" name="chk_${index}" value="Defeito" class="check-defeito" onclick="uncheckOthers(this, 'chk_${index}')">
            <input type="checkbox" name="chk_${index}" value="N/T" class="check-nt" onclick="uncheckOthers(this, 'chk_${index}')">
        `;
        container.appendChild(row);
    });
}

function uncheckOthers(current, groupName) {
    if (current.checked) {
        const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
        checkboxes.forEach(chk => {
            if (chk !== current) chk.checked = false;
        });
    }
}

// FORMATAR TEXTO DO RESUMO/WHATSAPP
function gerarTextoWhatsapp() {
    const osNum = document.getElementById('val-os').value || 'N/A';
    const dataEntrada = document.getElementById('dataEntrada').value || 'Não informada';
    const atendente = document.getElementById('val-atendente').value || 'N/A';
    const dataPrevisao = document.getElementById('dataPrevisao').value || 'Não informada';
    
    const cliente = document.getElementById('val-cliente').value || 'N/A';
    const telefone = document.getElementById('val-telefone').value || 'N/A';
    const cpf = document.getElementById('val-cpf').value || 'N/A';
    
    const modelo = document.getElementById('val-modelo').value || 'N/A';
    const cor = document.getElementById('val-cor').value || 'N/A';
    const imei = document.getElementById('val-imei').value || 'N/A';
    const senha = document.getElementById('val-senha').value || 'N/A';
    const icloud = document.getElementById('val-icloud').value || 'Não informado';
    const bateria = document.getElementById('val-bateria').value || 'N/A';
    const acessorios = document.getElementById('val-acessorios').value || 'Apenas o aparelho';
    const avarias = document.getElementById('val-avarias').value || 'Nenhuma avaria relatada';
    const defeito = document.getElementById('val-defeito').value || 'N/A';
    
    const total = document.getElementById('val-total').value || 'R$ 0,00';
    const sinal = document.getElementById('val-sinal').value || 'R$ 0,00';
    const restante = document.getElementById('val-restante').value || 'R$ 0,00';

    let checklistTexto = '';
    checklistItems.forEach((item, index) => {
        const selected = document.querySelector(`input[name="chk_${index}"]:checked`);
        const status = selected ? selected.value : 'N/T';
        let emoji = '➖';
        if (status === 'OK') emoji = '✅';
        if (status === 'Defeito') emoji = '❌';
        
        checklistTexto += `${emoji} ${item}: *${status}*\n`;
    });

    return `⚡️ *ELETROCELL - ORDEM DE SERVIÇO Nº ${osNum}* ⚡️\n` +
           `----------------------------------------\n` +
           `📅 *Data de Entrada:* ${dataEntrada}\n` +
           `👤 *Atendente:* ${atendente}\n` +
           `⏱️ *Previsão:* ${dataPrevisao}\n\n` +
           `👤 *CLIENTE:* ${cliente}\n` +
           `📞 *Telefone:* ${telefone}\n` +
           `🪪 *CPF:* ${cpf}\n\n` +
           `📱 *APARELHO:* ${modelo} (${cor})\n` +
           `🔢 *IMEI/Série:* ${imei}\n` +
           `🔑 *Senha:* ${senha}\n` +
           `☁️ *iCloud:* ${icloud}\n` +
           `🔋 *Saúde da Bateria:* ${bateria}\n` +
           `📦 *Acessórios:* ${acessorios}\n` +
           `🔍 *Avarias:* ${avarias}\n\n` +
           `📋 *CHECKLIST DE ENTRADA:*\n${checklistTexto}\n` +
           `🛠️ *DEFEITO RELATADO / SERVIÇO:*\n${defeito}\n\n` +
           `💰 *VALORES:*\n` +
           `• Total Estimado: ${total}\n` +
           `• Sinal Pago: ${sinal}\n` +
           `• Restante na Retirada: *${restante}*\n\n` +
           `----------------------------------------\n` +
           `💬 *Acompanhe seu serviço ou fale conosco pelo WhatsApp!*`;
}

// INICIALIZAÇÃO DE EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    renderChecklist();

    const btnGerarPreview = document.getElementById('btnGerarPreview');
    const btnVoltarEditar = document.getElementById('btnVoltarEditar');
    const btnEnviarWhatsapp = document.getElementById('btnEnviarWhatsapp');
    const btnCopiarPreview = document.getElementById('btnCopiarPreview');
    const btnGerarPdf = document.getElementById('btnGerarPdf');
    const btnLimparOs = document.getElementById('btnLimparOs');

    const osDocumento = document.getElementById('osDocumento');
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    const btnContainerPrincipal = document.getElementById('btnContainerPrincipal');

    if (btnGerarPreview) {
        btnGerarPreview.addEventListener('click', () => {
            const textoOS = gerarTextoWhatsapp();
            previewContent.textContent = textoOS;
            osDocumento.style.display = 'none';
            btnContainerPrincipal.style.display = 'none';
            previewContainer.style.display = 'flex';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnVoltarEditar) {
        btnVoltarEditar.addEventListener('click', () => {
            previewContainer.style.display = 'none';
            osDocumento.style.display = 'block';
            btnContainerPrincipal.style.display = 'flex';
        });
    }

    if (btnEnviarWhatsapp) {
        btnEnviarWhatsapp.addEventListener('click', () => {
            const texto = encodeURIComponent(gerarTextoWhatsapp());
            const telefoneCliente = document.getElementById('val-telefone').value.replace(/\D/g, '');
            
            let linkWhatsapp = `https://wa.me/?text=${texto}`;
            if (telefoneCliente.length >= 10) {
                linkWhatsapp = `https://wa.me/55${telefoneCliente}?text=${texto}`;
            }
            window.open(linkWhatsapp, '_blank');
        });
    }

    if (btnCopiarPreview) {
        btnCopiarPreview.addEventListener('click', () => {
            const texto = gerarTextoWhatsapp();
            navigator.clipboard.writeText(texto).then(() => {
                alert('Mensagem copiada com sucesso!');
            }).catch(() => {
                alert('Não foi possível copiar automaticamente.');
            });
        });
    }

    // GERAÇÃO DE PDF COM A LOGO CORRETA (WI-FI/SINAL) E NOME FORMATADO
    if (btnGerarPdf) {
        btnGerarPdf.addEventListener('click', () => {
            const cliente = document.getElementById('val-cliente').value.trim() || 'Cliente';
            const dataEntrada = document.getElementById('dataEntrada').value || 'SemData';

            const nomeArquivo = `eletrocell⚡️| ordem de serviço - ${cliente} - ${dataEntrada}`;
            const conteudoHtml = osDocumento.outerHTML;

            const janelaImpressao = window.open('', '_blank', 'width=800,height=900');
            
            janelaImpressao.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${nomeArquivo}</title>
                    <style>
                        * {
                            box-sizing: border-box;
                            margin: 0;
                            padding: 0;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        body {
                            background-color: #ffffff !important;
                            color: #000000 !important;
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            padding: 20px;
                        }
                        .pdf-logo-wrapper {
                            text-align: center;
                            margin-bottom: 12px;
                        }
                        .pdf-logo-wrapper svg {
                            width: 60px;
                            height: 60px;
                        }
                        .os-header-box {
                            text-align: center;
                            background: #f5f5f5 !important;
                            border: 1px solid #cccccc;
                            border-radius: 8px;
                            padding: 12px;
                            margin-bottom: 15px;
                        }
                        .os-store-name { font-weight: bold; font-size: 14px; margin-bottom: 4px; }
                        .os-store-info { font-size: 11px; color: #333; }
                        .os-container {
                            background: #ffffff !important;
                            border: 1px solid #cccccc;
                            border-radius: 8px;
                            padding: 15px;
                        }
                        .os-row { display: flex; gap: 10px; margin-bottom: 10px; }
                        .os-field { flex: 1; display: flex; flex-direction: column; }
                        .os-field label { font-size: 10px; font-weight: bold; color: #555; text-transform: uppercase; margin-bottom: 3px; }
                        .os-field input, .os-field textarea {
                            background: #ffffff !important;
                            border: 1px solid #cccccc !important;
                            color: #000000 !important;
                            padding: 6px 8px;
                            font-size: 12px;
                            border-radius: 4px;
                            width: 100%;
                        }
                        .os-section-title {
                            font-size: 11px; font-weight: bold; color: #cc4a00;
                            margin: 14px 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px;
                        }
                        .checklist-table { border: 1px solid #ccc; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
                        .checklist-header-row { display: grid; grid-template-columns: 1fr 40px 50px 40px; background: #eee; font-weight: bold; font-size: 10px; padding: 6px; text-align: center; }
                        .checklist-header-row span:first-child { text-align: left; }
                        .checklist-item-row { display: grid; grid-template-columns: 1fr 40px 50px 40px; padding: 6px; border-top: 1px solid #eee; font-size: 11px; text-align: center; }
                        .checklist-item-row span:first-child { text-align: left; }
                        .os-terms { font-size: 9px; color: #666; background: #f9f9f9; padding: 8px; border: 1px solid #eee; margin-top: 10px; border-radius: 4px; }
                        .os-signature-area { margin-top: 25px; text-align: center; font-size: 10px; color: #555; }
                        .signature-line { width: 200px; height: 1px; background: #888; margin: 0 auto 5px auto; }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="pdf-logo-wrapper">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="2" width="14" height="20" rx="3" stroke="#CC4A00" stroke-width="2" fill="none" />
                            <path d="M7.5 7.5C8.8 6.2 10.3 5.5 12 5.5C13.7 5.5 15.2 6.2 16.5 7.5" stroke="#CC4A00" stroke-width="1.8" stroke-linecap="round" />
                            <path d="M9.2 10.2C10 9.4 11 9 12 9C13 9 14 9.4 14.8 10.2" stroke="#CC4A00" stroke-width="1.8" stroke-linecap="round" />
                            <path d="M10.8 13C11.1 12.7 11.5 12.5 12 12.5C12.5 12.5 12.9 12.7 13.2 13" stroke="#CC4A00" stroke-width="1.8" stroke-linecap="round" />
                            <circle cx="12" cy="16.5" r="1" fill="#CC4A00" />
                        </svg>
                    </div>
                    ${conteudoHtml}
                </body>
                </html>
            `);

            janelaImpressao.document.close();
            janelaImpressao.focus();

            setTimeout(() => {
                janelaImpressao.print();
                janelaImpressao.close();
            }, 300);
        });
    }

    if (btnLimparOs) {
        btnLimparOs.addEventListener('click', () => {
            if (confirm('Deseja realmente limpar todos os campos para iniciar uma nova O.S.?')) {
                document.querySelectorAll('.os-container input, .os-container textarea').forEach(el => el.value = '');
                document.querySelectorAll('.os-container input[type="checkbox"]').forEach(el => el.checked = false);
            }
        });
    }
});
