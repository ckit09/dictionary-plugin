// Create context menu items on extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Menu item for dictionary lookup
  chrome.contextMenus.create({
    id: 'yahooLookup',
    title: 'Look up "%s" in Yahoo Dictionary',
    contexts: ['selection']
  });

  // Menu item for pronunciation
  // chrome.contextMenus.create({
  //   id: 'yahooPronounce',
  //   title: 'Pronounce "%s"',
  //   contexts: ['selection']
  // });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText.trim();

  if (info.menuItemId === 'yahooLookup') {
    // Open Yahoo Dictionary with the selected word
    const yahooUrl = `https://hk.dictionary.search.yahoo.com/search;_ylt=Awr1TUaTuxJqVwIA4qvDoolQ;_ylc=X1MDMTM1MTE5NzM3OQRfcgMyBGFjdG4Da2V5Ym9hcmQEZnIyA3A6cyx2OnNmcCxtOnNiLXRvcARncHJpZANoNHduN0R4eFQ2ZUhaQk9zNVdHR1RBBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DaGsuZGljdGlvbmFyeS5zZWFyY2gueWFob28uY29tBHBvcwMwBHBxc3RyAwRwcXN0cmwDMARxc3RybAMzBHF1ZXJ5A1lFUwRzZWMDc2VhcmNoBHNsawNidXR0b24EdDIDc2VhcmNoBHQ0A2tleWJvYXJkBHRfc3RtcAMxNzc5NjEyNTY1?p=${selectedText}`;
    chrome.tabs.create({ url: yahooUrl });
  } 
  else if (info.menuItemId === 'yahooPronounce') {
    // Try to find and play pronunciation audio from a dictionary source
    handlePronunciation(selectedText, tab);
  }
});

// Handle pronunciation - using Web Speech API
async function handlePronunciation(word, tab) {
  try {
    // Use Web Speech API through a new tab with inline script
    const pronounceUrl = `data:text/html,
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pronounce: ${word.replace(/"/g, '&quot;')}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container { 
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          h1 { 
            margin: 0 0 20px 0;
            color: #333;
          }
          button { 
            padding: 12px 24px; 
            font-size: 16px; 
            cursor: pointer; 
            background: #667eea; 
            color: white; 
            border: none; 
            border-radius: 5px;
            margin: 10px 5px;
            transition: background 0.3s;
          }
          button:hover { 
            background: #764ba2; 
          }
          #status { 
            margin-top: 20px; 
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>"${word}"</h1>
          <button id="pronounceBtn" onclick="pronounce()">🔊 Play Pronunciation</button>
          <button id="repeateBtn" onclick="repeatPronounce()" style="display:none;">🔁 Repeat</button>
          <p id="status"></p>
        </div>
        <script>
          function pronounce() {
            const utterance = new SpeechSynthesisUtterance('${word.replace(/'/g, "\\'")}');
            utterance.rate = 0.8;
            utterance.onstart = () => {
              document.getElementById('status').textContent = 'Playing...';
            };
            utterance.onend = () => {
              document.getElementById('status').textContent = 'Done! ✓';
              document.getElementById('repeateBtn').style.display = 'inline-block';
            };
            window.speechSynthesis.speak(utterance);
          }
          function repeatPronounce() {
            document.getElementById('repeateBtn').style.display = 'none';
            pronounce();
          }
          // Auto-play on load with a small delay
          window.addEventListener('load', () => {
            setTimeout(pronounce, 500);
          });
        </script>
      </body>
      </html>
    `.replace(/\n/g, ' ').trim();
    
    chrome.tabs.create({ url: pronounceUrl });
  } catch (error) {
    console.error('Pronunciation error:', error);
  }
}

// Store lookup history (optional - for future features)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveLookup') {
    chrome.storage.local.get(['lookupHistory'], (result) => {
      const history = result.lookupHistory || [];
      history.push({
        word: message.word,
        timestamp: new Date().toISOString(),
        url: sender.url
      });
      
      // Keep only last 100 lookups
      if (history.length > 100) {
        history.shift();
      }
      
      chrome.storage.local.set({ lookupHistory: history }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // Keep channel open for async response
  }
});
