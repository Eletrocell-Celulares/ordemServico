function setChecklist(button, status) {
    const itemContainer = button.closest('.checklist-item');
    const buttons = itemContainer.querySelectorAll('.chk-btn');
    
    buttons.forEach(btn => btn.classList.remove('active-ok'));
    button.classList.add('active-ok');
    
    itemContainer.setAttribute('data-selected', status);
}

function gerarPDF() {
    window.print();
}

function coletarDadosOS() {
    return {
        os: document.getElementById('osNumero').value || '000',
        data: document.getElementById('dataEntrada').value || '',
        atendente: document.getElementById('atendenteNome').value || '',
        previsao: document.getElementById('previsaoTermino').value || '',
        cliente: document.getElementById('clienteNome').value || '',
        contato: document.getElementById('clienteContato').value || '',
        cpf: document.getElementById('clienteCpf').value || '',
        modelo: document.getElementById('aparelhoModelo').value || '',
        cor: document.getElementById('aparelhoCor').value || '',
        imei: document.getElementById('aparelhoImei').value || '',
        senha: document.getElementById('aparelhoSenha').value || '',
        icloud: document.getElementById('aparelhoIcloud').value || '',
        bateria: document.getElementById('saudeBateria').value || '',
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
    document.getElementById('previewContainer').style.display = 'block';
    document.getElementById('previewContainer').scrollIntoView({ behavior: 'smooth' });
}

function enviarWhatsApp() {
    const d = coletarDadosOS();
    const textoBox = document.getElementById('previewBox').textContent;
    const numeroLimpo = d.contato.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=${encodeURIComponent(textoBox)}`;
    window.open(url, '_blank');
}
