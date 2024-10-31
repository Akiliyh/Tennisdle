// obsolete -> wikidata doesnt contain every players data


import puppeteerExtra from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import fetch from 'node-fetch';

puppeteerExtra.use(Stealth());

(async () => {
    const browserObj = await puppeteerExtra.launch();
    const newpage = await browserObj.newPage();

    await newpage.setViewport({ width: 1920, height: 1080 });
    await newpage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await newpage.goto('https://live-tennis.eu/fr/classement-atp-officiel');
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

    // Function to get Wikidata ID using Wikipedia API
    async function getWikidataId(wikipediaTitle) {
        const wikipediaApiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikipediaTitle)}&prop=pageprops&format=json&origin=*`;

        try {
            const response = await fetch(wikipediaApiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const page = Object.values(data.query.pages)[0];
            return page.pageprops?.wikibase_item || null; // Return the Wikidata ID
        } catch (error) {
            console.error('Error fetching Wikidata ID for ' + wikipediaApiUrl + ' :', error);
            return null;
        }
    }

    // Function to fetch player weight and height from Wikidata
    async function fetchWikiDataStatements(wikidataId) {
        const wikidataApiUrl = `https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/${wikidataId}/statements`;

        try {
            const response = await fetch(wikidataApiUrl, {
                headers: {
                    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJlZmJiZjBlZDg1YjlkYTA5ZjBmZTZmNjNiYmYzNzE1MyIsImp0aSI6ImViZDczNDYzYTY3YmNmMzhjYTQxYmMyZWMwOTAyMmYzODg0M2M3NTFmODQxMTEyNzljMDAzNGUyNTU1YmI2Y2RhZmI0ODcyZjYxMmVlNWY1IiwiaWF0IjoxNzMwMzczNzA0LjcxNjM5NCwibmJmIjoxNzMwMzczNzA0LjcxNjM5OCwiZXhwIjozMzI4NzI4MjUwNC43MTI3MDgsInN1YiI6IjY5MjIwMDE0IiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyJdfQ.LAN4r6gIBYPYe6wTZQPuKjN3J6HWuEWmt_WYXyWHwf4462YKP_xoLlJE98NpFWXizwvkNrmFyZsym_N8BYXygR-sHjNDLihoxRQBHH9XKCyjzEio4ZyRtEd5TnymLdXu1xmUiKnjv866c3WO72ta_ZsSNL_BkFnQVzncbpeOwIS4X3hH-2G565aDEWug_QpsdT9M-knjvM7gBBh0qjFCzSj89fJ65Gr161Mw4gjUwN-W2yGWo67aVguLqnIP6AxHVwt5APu8REUQuighTbfyWPKsAj9vARF2LtTUCYyAe4fSi5MTiG7doPfASh2D3v824jaAm8ibwRTLdzbgMEMVsVSkw1DQRYKRQ5MpmuKTlfErEs5p_zVS7pkBFAMDB5AAXlbTpTMOdebqVN7X43ybMCKPo495wquZaqG6NDGqskzTE6Ky4bjWn5gcgqJ-UIoaGDzFcq2m3-oT_zZNJBnZTF8sA18-aW_suRFe6hVpoOthmZZZNd8qs-vMR-Jmlw7v1aNvxKTwDasNW8njHOVK3pjs4_0B-l3pUoaxMXZ1_VTWvWg844jm-5ZfWqGsNbeXHs9HbwBG9Q0CkpN_P49oyrocSN5L8T1m-yAzrIw75syRb2FP81pbqOJiqnybZNPisp4oAnAJv3m0h6zZIGSMG8ygDts3ZPlji6pzY-WFA7A', // Replace with your token
                    'Api-User-Agent': 'Tennisdle',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const mass = data.P2067?.[0]?.value?.content?.amount;
            const height = data.P2048?.[0]?.value?.content?.amount;

            return { mass: mass ? `${mass} kg` : null, height: height ? `${height} cm` : null };
        } catch (error) {
            console.error('Error fetching Wikidata statements:', error);
            return { mass: null, height: null };
        }
    }

    // Loop through each player to add weight and height
    for (let player of extractedData) {
        const wikidataId = await getWikidataId(player.player);
        console.log(wikidataId);
        if (wikidataId) {
            const { mass, height } = await fetchWikiDataStatements(wikidataId);
            player.mass = mass;
            player.height = height;
        } else {
            player.mass = null;
            player.height = null;
        }
    }

    console.log(extractedData);

    fs.writeFileSync('atp_ranking_data.json', JSON.stringify(extractedData, null, 2));

    await browserObj.close();
})();
