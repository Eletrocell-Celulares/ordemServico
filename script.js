// Seleção visual e armazenamento do estado dos itens do checklist
function setChecklist(button, value) {
    const parentItem = button.closest('.checklist-item');
    const buttons = parentItem.querySelectorAll('.chk-btn');
    
    // Remove classes ativas de todos os botões do mesmo item
    buttons.forEach(btn => {
        btn.classList.remove('active-ok', 'active-def', 'active-nt');
    });

    // Aplica a classe correspondente ao botão clicado
    if (value === 'OK') {
        button.classList.add('active-ok');
    } else if (value === 'Defeito') {
        button.classList.add('active-def');
    } else {
        button.classList.add('active-nt');
    }

    // Atualiza o atributo lido pela regra CSS no PDF (ex: [ OK ])
    parentItem.setAttribute('data-selected', `[ ${value} ]`);
}

// Dispara a janela de impressão/salvar PDF do navegador
function gerarPDF() {
    window.print();
}

// Gera a mensagem para envio do WhatsApp
function gerarTextoWhatsApp() {
    const cliente = document.getElementById('clienteNome').value || 'Não informado';
    const contato = document.getElementById('clienteContato').value || 'Não informado';
    const modelo = document.getElementById('aparelhoModelo').value || 'Não informado';
    const imei = document.getElementById('aparelhoImei').value || 'N/A';
    const defeito = document.getElementById('defeitoRelatado').value || 'Não informado';
    const valor = document.getElementById('valorOrcamento').value || 'A combinar';
    const prazo = document.getElementById('prazoEstimado').value || 'A combinar';

    let checklistTxt = '';
    const items = document.querySelectorAll('.checklist-item');
    items.forEach(item => {
        const label = item.querySelector('.checklist-label').innerText;
        const status = item.getAttribute('data-selected') || '[ OK ]';
        checklistTxt += `• ${label}: ${status}\n`;
    });

    const mensagem = `*MÓDULO X - COMPROVANTE DE OS*\n` +
        `----------------------------------------\n` +
        `*Cliente:* ${cliente}\n` +
        `*Contato:* ${contato}\n` +
        `*Aparelho:* ${modelo}\n` +
        `*IMEI/Série:* ${imei}\n` +
        `----------------------------------------\n` +
        `*DEFEITO RELATADO:*\n${defeito}\n` +
        `----------------------------------------\n` +
        `*CHECKLIST DE ENTRADA:*\n${checklistTxt}` +
        `----------------------------------------\n` +
        `*Valor Estimado:* R$ ${valor}\n` +
        `*Prazo Estimado:* ${prazo}\n` +
        `----------------------------------------\n` +
        `_Obrigado por escolher a Módulo X!_`;

    document.getElementById('previewBox').innerText = mensagem;
    document.getElementById('previewContainer').style.display = 'block';
}

// Envia a mensagem gerada para o WhatsApp do cliente
function enviarWhatsApp() {
    const contatoRaw = document.getElementById('clienteContato').value.replace(/\D/g, '');
    const mensagem = encodeURIComponent(document.getElementById('previewBox').innerText);

    if (contatoRaw) {
        window.open(`https://wa.me/55${contatoRaw}?text=${mensagem}`, '_blank');
    } else {
        window.open(`https://wa.me/?text=${mensagem}`, '_blank');
    }
}
