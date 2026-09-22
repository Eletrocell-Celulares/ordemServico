// Itens do Checklist de Entrada, na ordem exibida no formulário
const checklistItems = [
    { key: 'tela', label: 'Tela / Touchscreen' },
    { key: 'carregamento', label: 'Carregamento / Conector' },
    { key: 'cameraTraseira', label: 'Câmera Traseira' },
    { key: 'cameraFrontal', label: 'Câmera Frontal' },
    { key: 'microfone', label: 'Microfone Principal' },
    { key: 'auricular', label: 'Auricular (Ligação)' },
    { key: 'altofalante', label: 'Alto-falante (Som)' },
    { key: 'wifi', label: 'Wi-Fi / Bluetooth' },
    { key: 'sinal', label: 'Sinal de Chip / Rede' },
    { key: 'botoes', label: 'Botões Volume / Power' },
    { key: 'biometria', label: 'Biometria / Face ID' },
    { key: 'proximidade', label: 'Sensor de Proximidade' },
    { key: 'carcaca', label: 'Carcaça / Vidro Traseiro' }
];

// Guarda o status escolhido (ok / defeito / nt) de cada item do checklist
let checklistState = {};

function setChecklistStatus(item, status, btn) {
    const linha = btn.closest('.checklist-item');
    linha.querySelectorAll('.chk-btn').forEach(b => {
        b.classList.remove('active-ok', 'active-defeito', 'active-nt');
    });
    btn.classList.add('active-' + status);
    checklistState[item] = status;
}

function montarTextoChecklist() {
    const statusLabel = { ok: 'OK', defeito: 'DEFEITO', nt: 'N/T' };
    return checklistItems
        .map(item => {
            const status = checklistState[item.key];
            return `${item.label}: ${status ? statusLabel[status] : '-'}`;
        })
        .join('\n');
}

function esc(valor) {
    const div = document.createElement('div');
    div.innerText = valor || '';
    return div.innerHTML;
}

function montarPdfSheet() {
    const osNum = esc(document.getElementById('osNum').value);
    const osData = esc(document.getElementById('osData').value);
    const osPrevisao = esc(document.getElementById('osPrevisao').value) || '-';
    const atendente = esc(document.getElementById('osAtendente').value);

    const clienteNome = esc(document.getElementById('clienteNome').value);
    const clienteTel = esc(document.getElementById('clienteTel').value);
    const clienteCpf = esc(document.getElementById('clienteCpf').value) || '-';

    const aparelhoModelo = esc(document.getElementById('aparelhoModelo').value);
    const aparelhoCor = esc(document.getElementById('aparelhoCor').value) || '-';
    const aparelhoImei = esc(document.getElementById('aparelhoImei').value) || '-';
    const aparelhoSenha = esc(document.getElementById('aparelhoSenha').value) || '-';
    const aparelhoBateria = document.getElementById('aparelhoBateria').value;
    const aparelhoAvarias = esc(document.getElementById('aparelhoAvarias').value) || '-';

    const statusLabel = { ok: 'OK', defeito: 'DEFEITO', nt: 'N/T' };
    const checklistHtml = checklistItems
        .map(item => {
            const status = checklistState[item.key];
            return `<div>${esc(item.label)}: <strong>${status ? statusLabel[status] : '-'}</strong></div>`;
        })
        .join('');

    return `
        <div class="pdf-sheet-header">
            <h2>ELETROCELL ⚡</h2>
            <p>ASSISTÊNCIA DE CELULARES</p>
            <span>Av. Getúlio Vargas, nº 40, Conceição do Jacuípe - BA · WhatsApp (75) 98171-8671</span>
        </div>

        <div class="pdf-section-block">
            <div class="pdf-block-title">Dados da O.S.</div>
            <div class="pdf-grid-2">
                <div><strong>Nº O.S.:</strong> ${osNum}</div>
                <div><strong>Data de Entrada:</strong> ${osData}</div>
                <div><strong>Atendente:</strong> ${atendente}</div>
                <div><strong>Previsão de Entrega:</strong> ${osPrevisao}</div>
            </div>
        </div>

        <div class="pdf-section-block">
            <div class="pdf-block-title">Dados do Cliente</div>
            <div class="pdf-grid-2">
                <div><strong>Nome:</strong> ${clienteNome}</div>
                <div><strong>Telefone:</strong> ${clienteTel}</div>
                <div><strong>CPF:</strong> ${clienteCpf}</div>
            </div>
        </div>

        <div class="pdf-section-block">
            <div class="pdf-block-title">Dados do Aparelho</div>
            <div class="pdf-grid-3">
                <div><strong>Modelo:</strong> ${aparelhoModelo}</div>
                <div><strong>Cor:</strong> ${aparelhoCor}</div>
                <div><strong>IMEI/Série:</strong> ${aparelhoImei}</div>
                <div><strong>Senha:</strong> ${aparelhoSenha}</div>
                <div><strong>Bateria:</strong> ${aparelhoBateria ? aparelhoBateria + '%' : '-'}</div>
            </div>
            <div style="margin-top:4px;"><strong>Avarias / Estado Físico:</strong> ${aparelhoAvarias}</div>
        </div>

        <div class="pdf-section-block">
            <div class="pdf-block-title">Checklist de Entrada (Testado no Balcão)</div>
            <div class="pdf-checklist-grid">
                ${checklistHtml}
            </div>
        </div>

        <div class="pdf-signature-section">
            <div class="pdf-sig-line"></div>
            <div class="pdf-sig-label">Assinatura do Cliente</div>
        </div>
    `;
}

function gerarOS() {
    const osNum = document.getElementById('osNum').value;
    const osData = document.getElementById('osData').value;
    const atendente = document.getElementById('osAtendente').value;
    const clienteNome = document.getElementById('clienteNome').value;
    const clienteTel = document.getElementById('clienteTel').value;
    const aparelhoModelo = document.getElementById('aparelhoModelo').value;
    const checklistTexto = montarTextoChecklist();

    const textoResumo = `ELETROCELL ⚡ - ORDEM DE SERVIÇO Nº ${osNum}
Data: ${osData}
Atendente: ${atendente}
----------------------------------------
CLIENTE: ${clienteNome}
CONTATO: ${clienteTel}
----------------------------------------
APARELHO: ${aparelhoModelo}
----------------------------------------
CHECKLIST DE ENTRADA:
${checklistTexto}
----------------------------------------
Eletrocell - Assistência Técnica`;

    document.getElementById('previewBox').innerText = textoResumo;
    document.getElementById('previewArea').style.display = 'block';
    document.getElementById('pdfSheet').innerHTML = montarPdfSheet();
}

function editarOS() {
    document.getElementById('previewArea').style.display = 'none';
}

function novaOS() {
    document.getElementById('osForm').reset();
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('pdfSheet').innerHTML = '';

    checklistState = {};
    document.querySelectorAll('#checklistTable .chk-btn').forEach(b => {
        b.classList.remove('active-ok', 'active-defeito', 'active-nt');
    });
}

function copiarTexto() {
    const texto = document.getElementById('previewBox').innerText;
    navigator.clipboard.writeText(texto);
    alert('Texto copiado com sucesso!');
}

function enviarWhatsapp() {
    const texto = encodeURIComponent(document.getElementById('previewBox').innerText);
    const tel = document.getElementById('clienteTel').value.replace(/\D/g, '');
    window.open(`https://api.whatsapp.com/send?phone=55${tel}&text=${texto}`, '_blank');
}
