// Get DOM elements
const contentDiv = document.getElementById('content');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const wordTitle = document.getElementById('wordTitle');
const definitionDiv = document.getElementById('definition');
const examplesDiv = document.getElementById('examples');
const pronounceBtn = document.getElementById('pronounceBtn');
const viewFullBtn = document.getElementById('viewFullBtn');
const errorMessage = document.getElementById('errorMessage');
const closeBtn = document.getElementById('closeBtn');

let currentWord = '';
let currentUrl = '';

// Close button functionality
closeBtn.addEventListener('click', () => {
  chrome.sidePanel.setOptions({ path: '' });
});

// Pronounce button
pronounceBtn.addEventListener('click', () => {
  if (currentWord) {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
});

// View full definition button
viewFullBtn.addEventListener('click', () => {
  if (currentWord) {
    const yahooUrl = `https://dictionary.yahoo.com/dictionary/${encodeURIComponent(currentWord)}`;
    chrome.tabs.create({ url: yahooUrl });
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showDefinition') {
    displayDefinition(message.word);
  }
});

// Display definition in side panel
function displayDefinition(word) {
  currentWord = word;
  
  // Reset display
  contentDiv.style.display = 'none';
  loadingDiv.style.display = 'block';
  resultDiv.style.display = 'none';
  errorDiv.style.display = 'none';
  
  // Show loading state briefly then display result
  setTimeout(() => {
    loadingDiv.style.display = 'none';
    showWordResult(word);
  }, 500);
}

// Show word result (mock data for demo)
function showWordResult(word) {
  wordTitle.textContent = word;
  
  // Mock definition data - in real app, you'd fetch from an API
  const mockDefinitions = {
    hello: {
      definition: 'A polite expression of goodwill upon meeting.',
      examples: [
        '"Hello, how are you doing?"',
        '"She said hello to me at the store."'
      ]
    },
    example: {
      definition: 'A thing characteristic of its kind or illustrating a general rule; a specimen, instance, or illustration.',
      examples: [
        '"An example of his generosity"',
        '"Set an example for others to follow"'
      ]
    },
    default: {
      definition: 'Word definition not found in local cache. Click "View Full Definition" to open Yahoo Dictionary.',
      examples: []
    }
  };
  
  const data = mockDefinitions[word.toLowerCase()] || mockDefinitions.default;
  
  // Display definition
  definitionDiv.innerHTML = `<p><strong>Definition:</strong><br>${data.definition}</p>`;
  
  // Display examples
  if (data.examples && data.examples.length > 0) {
    examplesDiv.innerHTML = '<p><strong>Examples:</strong></p>' + 
      data.examples.map(ex => `<div class="example">${ex}</div>`).join('');
  } else {
    examplesDiv.innerHTML = '';
  }
  
  resultDiv.style.display = 'block';
}

// On load, show placeholder
document.addEventListener('DOMContentLoaded', () => {
  // Optionally load recent word if available
  chrome.storage.local.get(['lastWord'], (result) => {
    if (result.lastWord) {
      currentWord = result.lastWord;
      showWordResult(result.lastWord);
      resultDiv.style.display = 'block';
      contentDiv.style.display = 'none';
    }
  });
});
