import puppeteerExtra from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteerExtra.use(Stealth());

(async () => {
    const browserObj = await puppeteerExtra.launch();
    const newpage = await browserObj.newPage();
  
    await newpage.setViewport({ width: 1920, height: 1080 });
  
    await newpage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );
  
    await newpage.goto('https://live-tennis.eu/fr/classement-wta-officiel');
    await newpage.waitForNetworkIdle(); // Wait for network resources to fully load
  
    const extractedData = await newpage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#plyrRankings tbody tr'));
        
        return rows.map(row => {
            const rank = row.querySelector('td:nth-child(1)')?.innerText || '';
            const player = row.querySelector('td:nth-child(3)')?.innerText || '';
            const age = row.querySelector('td:nth-child(4)')?.innerText || '';
            const country = row.querySelector('td:nth-child(5)')?.innerText || '';
            const points = row.querySelector('td:nth-child(6)')?.innerText || '';
            return { rank, player, age, country, points };
        });
    });

    console.log(extractedData);

    fs.writeFileSync('wta_ranking_data.json', JSON.stringify(extractedData, null, 2));

    await browserObj.close();
})();
