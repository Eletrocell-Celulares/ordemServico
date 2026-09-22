function gerarOS() {
    const osNum = document.getElementById('osNum').value;
    const osData = document.getElementById('osData').value;
    const atendente = document.getElementById('osAtendente').value;
    const clienteNome = document.getElementById('clienteNome').value;
    const clienteTel = document.getElementById('clienteTel').value;
    const aparelhoModelo = document.getElementById('aparelhoModelo').value;

    const textoResumo = `ELETROCELL ⚡ - ORDEM DE SERVIÇO Nº ${osNum}
Data: ${osData}
Atendente: ${atendente}
----------------------------------------
CLIENTE: ${clienteNome}
CONTATO: ${clienteTel}
----------------------------------------
APARELHO: ${aparelhoModelo}
----------------------------------------
Eletrocell - Assistência Técnica`;

    document.getElementById('previewBox').innerText = textoResumo;
    document.getElementById('previewArea').style.display = 'block';
}

function editarOS() {
    document.getElementById('previewArea').style.display = 'none';
}

function novaOS() {
    document.getElementById('osForm').reset();
    document.getElementById('previewArea').style.display = 'none';
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
