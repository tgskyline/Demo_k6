const http = require('k6/http');
const { check, sleep } = require('k6');

// Executa quantas requisições forem possíveis dentro da duração máxima desejada
// Quando usar:
// Com o número específico de Vus seja executado em um período especificado de tempo

export const options = {
    scenarios:{
        contacts:{
            executor: 'constant-vus',
            vus:5,  // Número de usuários virtuais ou usuários simultâneos
            duration:'5s',  // Duração da execução do teste
        },
    },
};

export default function () { 
    const BASE_URL = 'https://demo.opencart.com/en-gb?' // URL base da aplicação
    const ENDPOINTAUTH = 'route=account/login.login&login_token='   // Endpoint de autenticação
    const ENDPOINTADDCART = 'route=checkout/cart.add' //    Endpoint de adicionar produto no carr
    const USER = 'teste123456@gmail.com' // Usuário para autenticação
    const PASS = '123456';  // Senha para autenticação
    const product_id = '28'; // ID do produto a ser adicionado no carrinho
    const quantity = '1'; // Quantidade do produto a ser adicionado no carrinho
    const HEADERS = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        'Cookie':'OCSESSID=681cbde989b5c68d7984ed4d89; currency=USD; cf_clearance=TzFOCe8xOB4cAihRU1Ijn3Xv.HdPb4bmACtkQfVQg98-1741379295-1.2.1.1-ObuowHLZ0dnlCp8Ub_b7tEFmCjzalLdK7gIr4Zv2.VhHqN5yYyqAHEx8JP3GDKK0MSFD6qkS4xGCBmwSVPkVpdXXYfwGVaeDg75cavpkHMgD.xRztNJYbrlbUwvIqKIVe70cVrxa2W93V3eQuWh.gjxWagKpsbX_MmKu7HmDKEEBVJWjStQrCdL0Jvt5vMI.Rcc6LBi99thaVZuvAdBy1PoW7tMh.n9TH3_zWV691HdE9gYKQ7sa6YcIZL7H0LG0_TZyCTxLcNMoyymVa4SNCGe2trnURHTgfBz9de_rfnDuAJu8T5PLX0HWQWZxeryj9iuWbRdAaIAE4vXzbHFaUtE0l6rzUXkHcZy78MXbXy32nM65Ep070J.AWlUynp3z5kUeBl9cV_lrnSMD.xoNNbLLjxib0C4R9Q1wC_JTOwcOdCPvZMow3ja6Bc9131cJj_PGrEEvIGitZnjHfrcfNsafeA_VyY9r.KgVhCSnnHI'
    };

    // Autenticação
    const resauth = http.post(`${BASE_URL}${ENDPOINTAUTH}`, {
        email: USER,
        password: PASS
    },
        { headers: HEADERS }
    );

    const jsonData = resauth.json(); // Obtém o JSON corretamente
    const match = jsonData.redirect.match(/customer_token=([^&]+)/);
    let token = "";

    if (jsonData.redirect) {
        const match = jsonData.redirect.match(/customer_token=([^&]+)/);
        if (match) {
            console.log("Token gerado: " + match[1]); // Exibe apenas o token
            token = match[1];
        }
    } else {
        console.error("Redirect não encontrado na resposta.");
    }
    
    // Verifica se o login foi bem-sucedido
    check(resauth, {
        'sucesso ao logar': (r) => r.status === 200,
    });

    // Adiciona produto no carrinho
    const resaddcart = http.post(`${BASE_URL}${ENDPOINTADDCART}${token}`, {
        product_id: product_id,
        quantity: quantity,
        customer_token: token
    },
        { headers: HEADERS }
    );

    // Verifica se o produto foi adicionado no carrinho
    check(resaddcart, {
        'sucesso ao adicionar produto no carrinho': (r) => r.status === 200,
    });
 
    // Aguarda 1 segundo antes de executar a próxima iteração
    sleep(1)

}