import { check, sleep } from 'k6';
import http from 'k6/http';

// Função para gerar um número randomico
function getRandomNumber() {
    return Math.floor(1000 + Math.random() * 9000); // Número entre 1000 e 9999
}

// Função para analisar/parse manual do CSV
function parseCSV(csvString) {
    let linhas = csvString.split('\n').filter(l => l.trim() !== ''); // Remove linhas vazias
    let cabecalho = linhas.shift().split(';'); // Ajustando separador correto

    return linhas.map(linha => {
        let valores = linha.split(';');
        let obj = {};
        cabecalho.forEach((coluna, index) => {
            obj[coluna.trim()] = valores[index] ? valores[index].trim() : '';
        });
        return obj;
    });
}

// Lendo o CSV
const csvData = parseCSV(open('./massa_teste.csv'));

if (csvData.length === 0) {
    console.error("Erro: Nenhum dado foi carregado do CSV!");
}

export let options = {
    vus: 5, // 5 usuários simultâneos
    duration: '1s', // Tempo do teste
};

export default function () {
    let user = csvData[(__VU - 1) % csvData.length]; // Pegando usuário correto
    let randomNumber = getRandomNumber(); // Gerando número aleatório

    let uniqueUsername = `${user.username}_${randomNumber}`; 
    let uniqueEmail = `${user.username}${randomNumber}@teste.com`; // Email único

    // console.log(`Usuário: ${uniqueUsername}, Email: ${uniqueEmail}, Sobrenome: ${user.last_name}`);

    const url = 'https://test-api.k6.io/user/register/';
    
    let payload = JSON.stringify({
        username: uniqueUsername, // Adicionando o número aleatório ao username
        first_name: user.first_name,
        last_name: user.last_name,
        email: uniqueEmail, // Adicionando o número aleatório ao email
        password: user.password
    });

    console.log(`Payload: ${payload}`);

    let params = {
        headers: { 'Content-Type': 'application/json' },
    };

    let res = http.post(url, payload, params);

    check(res, {
        'status é 201': (r) => r.status === 201,
    });

    sleep(1);
}