import puppeteerExtra from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteerExtra.use(Stealth());

const toCapitalCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

(async () => {
    const browserObj = await puppeteerExtra.launch();
    const newpage = await browserObj.newPage();
  
    await newpage.setViewport({ width: 1920, height: 1080 });
  
    await newpage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await newpage.goto('https://www.atptour.com/en/rankings/singles?rankRange=0-250');
    await newpage.waitForSelector('.mega-table tbody tr'); // Wait for rankings table to load
  
    const players = await newpage.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.mega-table.desktop-table tbody tr.lower-row'));
        
        return rows.map(row => {
            const rank = row.querySelector('td.rank')?.innerText || '';
            const player = row.querySelector('td.player-cell a')?.innerText.trim() || '';
            const playerLink = row.querySelector('.player-stats a')?.href || ''; // Profile link
            const age = row.querySelector('td.age-cell')?.innerText.trim() || '';
            return { rank, player, playerLink, age};
        });
    });

    console.log(players);

    // Iterate over each player to fetch their full name from their profile page
    for (let player of players) {
        if (player.playerLink) {
            try {
                // Open a new page for each player profile
                const profilePage = await browserObj.newPage();
                await profilePage.goto(player.playerLink);
                await profilePage.waitForSelector('.player_name');

                const profileData = await profilePage.evaluate(() => {
                    const player = document.querySelector('.player_name')?.innerText.trim() || '';
                    
                    const bioData = {};
                    const bioItems = document.querySelectorAll('.pd_content li');
                    bioItems.forEach(item => {
                        const label = item.querySelector('span:nth-child(1)')?.innerText.trim() || '';
                        const value = item.querySelector('span:nth-child(2)')?.innerText.trim() || '';
                        if (label && value) {
                            bioData[label.toLowerCase()] = value; // Store by label name (e.g., "weight", "height", "plays")
                        }
                    });

                    return {
                        player,
                        age: bioData['age'] || '',
                        weight: bioData['weight'] || '',
                        height: bioData['height'] || '',
                        handedness: bioData['plays'] || '',
                        country: bioData['country'] || ''
                    };
                });
                
                player.player = toCapitalCase(profileData.player);
                player.age = profileData.age;
                player.weight = profileData.weight;
                player.height = profileData.height;
                player.handedness = profileData.handedness;
                player.country = profileData.country;
                console.log(player.player + ' completed');
                console.log(player.rank + "/250");

                await profilePage.close(); // Close the profile page
            } catch (error) {
                console.error(`Error fetching profile for ${player.player}:`, error);
                player.player = null;
            }
        } else {
            player.player = null; // No profile link available
        }
    }

    console.log(players);

    fs.writeFileSync('atp_ranking_data.json', JSON.stringify(players, null, 2));

    await browserObj.close();
})();
