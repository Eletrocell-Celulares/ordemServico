function setChecklist(button, status) {
    const itemContainer = button.closest('.checklist-item');
    itemContainer.setAttribute('data-selected', status);
    
    const buttons = itemContainer.querySelectorAll('.chk-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active-ok', 'active-defeito', 'active-nt');
    });

    if (status === 'OK') {
        button.classList.add('active-ok');
    } else if (status === 'Defeito') {
        button.classList.add('active-defeito');
    } else if (status === 'N/T') {
        button.classList.add('active-nt');
    }
}

function formatarMoedaInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
        e.target.value = '';
        return;
    }
    value = (parseInt(value, 10) / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    e.target.value = value;
}

document.querySelectorAll('.money-input').forEach(input => {
    input.addEventListener('input', formatarMoedaInput);
});

function formatarTelefone(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
        v = `(${v}`;
    }
    e.target.value = v;
}

const telInput = document.getElementById('clienteContato');
if (telInput) {
    telInput.addEventListener('input', formatarTelefone);
}

function formatarCPF(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) {
        v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
    } else if (v.length > 6) {
        v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    } else if (v.length > 3) {
        v = `${v.slice(0,3)}.${v.slice(3)}`;
    }
    e.target.value = v;
}

const cpfInput = document.getElementById('clienteCpf');
if (cpfInput) {
    cpfInput.addEventListener('input', formatarCPF);
}

function coletarDadosOS() {
    return {
        os: document.getElementById('osNumero').value || '---',
        data: document.getElementById('dataEntrada').value || '---',
        atendente: document.getElementById('atendenteNome').value || '---',
        previsao: document.getElementById('previsaoTermino').value || '---',
        cliente: document.getElementById('clienteNome').value || '---',
        contato: document.getElementById('clienteContato').value || '---',
        cpf: document.getElementById('clienteCpf').value || '---',
        modelo: document.getElementById('aparelhoModelo').value || '---',
        cor: document.getElementById('aparelhoCor').value || '---',
        imei: document.getElementById('aparelhoImei').value || '---',
        bateria: document.getElementById('saudeBateria').value || '---',
        senha: document.getElementById('aparelhoSenha').value || '---',
        icloud: document.getElementById('aparelhoIcloud').value || '',
        acessorios: document.getElementById('acessoriosDeixados').value || '---',
        avarias: document.getElementById('observacoesAvarias').value || '',
        defeito: document.getElementById('defeitoRelatado').value || '---',
        total: document.getElementById('valorTotal').value || '0,00',
        sinal: document.getElementById('valorSinal').value || '0,00',
        restante: document.getElementById('valorRestante').value || '0,00'
    };
}

function gerarTextoWhatsApp() {
    const d = coletarDadosOS();
    
    // Preenche a folha estruturada para PDF/Impressão
    document.getElementById('p-os').textContent = d.os;
    document.getElementById('p-data').textContent = d.data;
    document.getElementById('p-atendente').textContent = d.atendente;
    document.getElementById('p-previsao').textContent = d.previsao;
    document.getElementById('p-cliente').textContent = d.cliente;
    document.getElementById('p-contato').textContent = d.contato;
    document.getElementById('p-cpf').textContent = d.cpf;
    document.getElementById('p-modelo').textContent = d.modelo;
    document.getElementById('p-cor').textContent = d.cor;
    document.getElementById('p-imei').textContent = d.imei;
    document.getElementById('p-bateria').textContent = d.bateria;
    document.getElementById('p-senha').textContent = d.senha;
    document.getElementById('p-icloud').textContent = d.icloud || 'Não informado';
    document.getElementById('p-acessorios').textContent = d.acessorios;
    document.getElementById('p-avarias').textContent = d.avarias || 'Nenhuma avaria relatada';
    document.getElementById('p-defeito').textContent = d.defeito;
    document.getElementById('p-total').textContent = d.total;
    document.getElementById('p-sinal').textContent = d.sinal;
    document.getElementById('p-restante').textContent = d.restante;

    // Preenche o checklist no PDF
    let checklistPdfHtml = '';
    document.querySelectorAll('.checklist-item').forEach(item => {
        const nomeItem = item.getAttribute('data-item');
        const status = item.getAttribute('data-selected');
        checklistPdfHtml += `<div>• ${nomeItem}: <strong>[ ${status} ]</strong></div>`;
    });
    document.getElementById('p-checklist').innerHTML = checklistPdfHtml;

    // Preenche também a caixa de texto para o WhatsApp
    let checklistTxt = '';
    document.querySelectorAll('.checklist-item').forEach(item => {
        const nomeItem = item.getAttribute('data-item');
        const status = item.getAttribute('data-selected');
        checklistTxt += `- ${nomeItem}: *[ ${status} ]*\n`;
    });

    const mensagem = `*ELETROCELL ⚡ - ORDEM DE SERVIÇO*\n` +
        `----------------------------------------\n` +
        `*OS Nº:* ${d.os} | *Data:* ${d.data}\n` +
        `*Atendente:* ${d.atendente}\n` +
        `----------------------------------------\n` +
        `*CLIENTE:* ${d.cliente}\n` +
        `*Contato:* ${d.contato}\n` +
        `*CPF:* ${d.cpf}\n` +
        `----------------------------------------\n` +
        `*APARELHO:* ${d.modelo} (${d.cor})\n` +
        `*IMEI/Série:* ${d.imei}\n` +
        `*Bateria:* ${d.bateria} | *Acessórios:* ${d.acessorios}\n` +
        `----------------------------------------\n` +
        `*CHECKLIST:*\n${checklistTxt}` +
        `----------------------------------------\n` +
        `*Defeito/Relato:* ${d.defeito}\n` +
        `----------------------------------------\n` +
        `*Valor Total:* R$ ${d.total}\n` +
        `*Sinal Pago:* R$ ${d.sinal}\n` +
        `*Restante:* R$ ${d.restante}\n` +
        `----------------------------------------\n` +
        `_Obrigado pela preferência na Eletrocell!_`;

    document.getElementById('previewBox').textContent = mensagem;
    
    document.getElementById('osForm').style.display = 'none';
    document.getElementById('previewContainer').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function gerarPDF() {
    window.print();
}

function enviarWhatsApp() {
    const d = coletarDadosOS();
    const texto = document.getElementById('previewBox').textContent;
    const url = `https://api.whatsapp.com/send?phone=55${d.contato.replace(/\D/g, '')}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

function copiarMensagem() {
    const texto = document.getElementById('previewBox').textContent;
    navigator.clipboard.writeText(texto).then(() => {
        alert('Mensagem copiada para a área de transferência!');
    });
}

function voltarEditar() {
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('osForm').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function novaOS() {
    document.getElementById('osForm').reset();
    document.querySelectorAll('.checklist-item').forEach(item => {
        item.setAttribute('data-selected', 'OK');
        const buttons = item.querySelectorAll('.chk-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active-ok', 'active-defeito', 'active-nt');
            if (btn.textContent === 'OK') {
                btn.classList.add('active-ok');
            }
        });
    });
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('osForm').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const hoje = new Date().toISOString().split('T')[0];
const dataEntradaEl = document.getElementById('dataEntrada');
if (dataEntradaEl && !dataEntradaEl.value) {
    dataEntradaEl.value = hoje;
}
