// Importando as bibliotecas e frameworks necessários
const { chromium } = require('playwright');
const fs = require('fs');


async function scrapingNotebooks(){
    console.time('Tempo de execução')
    const baseUrl = 'https://webscraper.io'

    // Criando o browser e conectando à página
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');

    // Iterando todas os notebooks para pegar os links apenas dos notebooks que contêm a palavra 'Lenovo' ou 'Thinkpad'(Linha de notebooks da Lenovo)
    const allNotebooks = await page.$$('.col-sm-4.col-lg-4.col-md-4');
    let links = [];
    for (let i = 0; i < allNotebooks.length; i++) {
        let notebookTitle = (await (await allNotebooks[i].$('.title')).innerText()).toUpperCase();
        let link = await (await allNotebooks[i].$("a")).getAttribute('href');
        if (notebookTitle.includes('LENOVO') || notebookTitle.includes('THINKPAD')){
            links.push(link)
        }
    }

    // Iterando todos os links armazenados e pegando todas as informações detalhadas dos notebooks selecionados
    let dataset = [];
    for (let x = 0; x < links.length; x++) {
        let data = {};
        await page.goto(baseUrl + links[x]);

        // Nome do modelo do notebook
        let notebookName = await page.$('h4:nth-child(2)')
        data['Notebook'] = await notebookName.innerText();

        // Descrição
        let description = await page.$('.description')
        data['Description'] = ((await description.innerText()).replace("\"", ""));

        // Valor do HDD 128
        await page.locator('[value="128"]').click();
        let hdd128 = await page.$('.pull-right.price')
        data['HDD 128 Price'] = await hdd128.innerText();

        // Valor do HDD 256
        await page.locator('[value="256"]').click();
        let hdd256 = await page.$('.pull-right.price')
        data['HDD 256 Price'] = await hdd256.innerText();

        // Valor do HDD 512
        await page.locator('[value="512"]').click();
        let hdd512 = await page.$('.pull-right.price')
        data['HDD 512 Price'] = await hdd512.innerText();

        // Valor do HDD 1024
        await page.locator('[value="1024"]').click();
        let hdd1024 = await page.$('.pull-right.price')
        data['HDD 1024 Price'] = await hdd1024.innerText();

        // Estrelas
        let stars = await page.locator('.glyphicon.glyphicon-star').count();
        data['Stars'] = stars.toString();

        // Reviews
        let reviews = await page.$('div.ratings>p')
        data['Reviews'] = (await reviews.innerText()).trim();

        // Armazenando toda a data gerada em uma lista utilizando a função push
        dataset.push(data);
    }

    // Armazenando a lista em uma constante e fazendo a conversão dela em um arquivo JSON
    const dadosFinais = dataset;
    const formattedData = JSON.stringify(dadosFinais,null, 4);
    fs.writeFileSync('dadosFinais.json', formattedData);

    // Fechando o browser
    await browser.close();
    console.timeEnd('Tempo de execução')
}
scrapingNotebooks()
