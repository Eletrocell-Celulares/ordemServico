function setChecklist(button, status) {
    const itemContainer = button.closest('.checklist-item');
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
    
    itemContainer.setAttribute('data-selected', status);
}

function gerarPDF() {
    // Renomeia temporariamente o título da página para forçar o nome do arquivo ao imprimir/salvar PDF
    const tituloAntigo = document.title;
    document.title = "Eletrocell⚡️ | Ordem de serviço";
    window.print();
    setTimeout(() => {
        document.title = tituloAntigo;
    }, 1000);
}

// Máscaras e Validações
document.addEventListener('DOMContentLoaded', () => {
    const inputTelefone = document.getElementById('clienteContato');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 6) {
                v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
            } else if (v.length > 2) {
                v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
            } else if (v.length > 0) {
                v = `(${v}`;
            }
            e.target.value = v;
        });
    }

    const inputCpf = document.getElementById('clienteCpf');
    if (inputCpf) {
        inputCpf.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 9) {
                v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
            } else if (v.length > 6) {
                v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
            } else if (v.length > 3) {
                v = `${v.slice(0, 3)}.${v.slice(3)}`;
            }
            e.target.value = v;
        });
    }

    // Validação da saúde da bateria (mínimo 60, máximo 100)
    const inputBateria = document.getElementById('saudeBateria');
    if (inputBateria) {
        inputBateria.addEventListener('input', (e) => {
            let val = parseInt(e.target.value);
            if (!isNaN(val)) {
                if (val > 100) e.target.value = 100;
                if (val < 0 && e.target.value.length > 1) e.target.value = 60;
            }
        });
        inputBateria.addEventListener('blur', (e) => {
            let val = parseInt(e.target.value);
            if (!isNaN(val)) {
                if (val < 60) {
                    alert('A saúde da bateria deve ser de no mínimo 60%.');
                    e.target.value = 60;
                }
            }
        });
    }

    // Máscara automática para Reais (R$)
    const moneyInputs = document.querySelectorAll('.money-input');
    moneyInputs.forEach(input => {
        if (!input.value) input.value = '0,00';

        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value === '') {
                e.target.value = '0,00';
                return;
            }
            let numberValue = parseInt(value, 10) / 100;
            e.target.value = numberValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        });

        input.addEventListener('focus', (e) => {
            e.target.select();
        });
    });
});

function formatarDataBR(dataIso) {
    if (!dataIso) return '';
    const partes = dataIso.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataIso;
}

function coletarDadosOS() {
    let bateriaVal = document.getElementById('saudeBateria').value;
    if (bateriaVal && !bateriaVal.includes('%')) {
        bateriaVal += '%';
    }

    return {
        os: document.getElementById('osNumero').value || '000',
        data: formatarDataBR(document.getElementById('dataEntrada').value),
        atendente: document.getElementById('atendenteNome').value || '',
        previsao: formatarDataBR(document.getElementById('previsaoTermino').value),
        cliente: document.getElementById('clienteNome').value || '',
        contato: document.getElementById('clienteContato').value || '',
        cpf: document.getElementById('clienteCpf').value || '',
        modelo: document.getElementById('aparelhoModelo').value || '',
        cor: document.getElementById('aparelhoCor').value || '',
        imei: document.getElementById('aparelhoImei').value || '',
        senha: document.getElementById('aparelhoSenha').value || '',
        icloud: document.getElementById('aparelhoIcloud').value || '',
        bateria: bateriaVal || '',
        acessorios: document.getElementById('acessoriosDeixados').value || '',
        avarias: document.getElementById('observacoesAvarias').value || '',
        defeito: document.getElementById('defeitoRelatado').value || '',
        total: document.getElementById('valorTotal').value || '0,00',
        sinal: document.getElementById('valorSinal').value || '0,00',
        restante: document.getElementById('valorRestante').value || '0,00'
    };
}

function gerarTextoWhatsApp() {
    const d = coletarDadosOS();
    
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
    
    // Esconde o formulário e exibe a pré-visualização
    document.getElementById('osForm').style.display = 'none';
    document.getElementById('previewContainer').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function enviarWhatsApp() {
    const d = coletarDadosOS();
    const textoBox = document.getElementById('previewBox').textContent;
    const numeroLimpo = d.contato.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=${encodeURIComponent(textoBox)}`;
    window.open(url, '_blank');
}

function copiarMensagem() {
    const textoBox = document.getElementById('previewBox').textContent;
    navigator.clipboard.writeText(textoBox).then(() => {
        alert('Mensagem copiada para a área de transferência!');
    }).catch(err => {
        alert('Erro ao copiar mensagem.');
    });
}

function voltarEditar() {
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('osForm').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function novaOS() {
    document.getElementById('osForm').reset();
    
    // Reseta valores monetários para padrão
    document.querySelectorAll('.money-input').forEach(input => input.value = '0,00');

    // Reseta checklist para OK em tudo por padrão
    document.querySelectorAll('.checklist-item').forEach(item => {
        const buttons = item.querySelectorAll('.chk-btn');
        buttons.forEach(btn => btn.classList.remove('active-ok', 'active-defeito', 'active-nt'));
        const okBtn = item.querySelector('.chk-btn'); // Primeiro botão (OK)
        if (okBtn) okBtn.classList.add('active-ok');
        item.setAttribute('data-selected', 'OK');
    });

    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('osForm').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
