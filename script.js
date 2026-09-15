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

// GARANTE QUE APENAS UMA OPÇÃO (OK, DEFEITO, N/T) SEJA SELECIONADA POR ITEM
function uncheckOthers(current, groupName) {
    if (current.checked) {
        const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
        checkboxes.forEach(chk => {
            if (chk !== current) chk.checked = false;
        });
    }
}

// GERA O TEXTO DA MENSAGEM DO WHATSAPP
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

// INICIALIZAÇÃO E EVENTOS
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

    btnGerarPreview.addEventListener('click', () => {
        const textoOS = gerarTextoWhatsapp();
        previewContent.textContent = textoOS;
        osDocumento.style.display = 'none';
        btnContainerPrincipal.style.display = 'none';
        previewContainer.style.display = 'flex';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnVoltarEditar.addEventListener('click', () => {
        previewContainer.style.display = 'none';
        osDocumento.style.display = 'block';
        btnContainerPrincipal.style.display = 'flex';
    });

    btnEnviarWhatsapp.addEventListener('click', () => {
        const texto = encodeURIComponent(gerarTextoWhatsapp());
        const telefoneCliente = document.getElementById('val-telefone').value.replace(/\D/g, '');
        
        let linkWhatsapp = `https://wa.me/?text=${texto}`;
        if (telefoneCliente.length >= 10) {
            linkWhatsapp = `https://wa.me/55${telefoneCliente}?text=${texto}`;
        }
        window.open(linkWhatsapp, '_blank');
    });

    btnCopiarPreview.addEventListener('click', () => {
        const texto = gerarTextoWhatsapp();
        navigator.clipboard.writeText(texto).then(() => {
            alert('Mensagem copiada com sucesso!');
        }).catch(() => {
            alert('Não foi possível copiar automaticamente.');
        });
    });

    // GERAR PDF COM NOME PERSONALIZADO (CLIENTE E DATA)
    btnGerarPdf.addEventListener('click', () => {
        const tituloOriginal = document.title;
        const cliente = document.getElementById('val-cliente').value.trim();
        const dataEntrada = document.getElementById('dataEntrada').value;

        let complemento = "";
        if (cliente) complemento += ` - ${cliente}`;
        if (dataEntrada) complemento += ` - ${dataEntrada}`;

        // Atualiza o título da página temporariamente antes de disparar o print
        document.title = `ELETROCELL ⚡️ | Ordem de Serviço${complemento}`;

        window.print();

        // Restaura o título original após abrir a janela de impressão
        setTimeout(() => {
            document.title = tituloOriginal;
        }, 1000);
    });

    btnLimparOs.addEventListener('click', () => {
        if (confirm('Deseja realmente limpar todos os campos para iniciar uma nova O.S.?')) {
            document.querySelectorAll('.os-container input, .os-container textarea').forEach(el => el.value = '');
            document.querySelectorAll('.os-container input[type="checkbox"]').forEach(el => el.checked = false);
        }
    });
});
