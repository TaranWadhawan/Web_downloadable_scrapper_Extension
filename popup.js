document.getElementById('scanBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) return;

  const resultsDiv = document.getElementById('results');
  resultsDiv.textContent = "Scanning...";

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }, (results) => {
    if (chrome.runtime.lastError || !results || !results[0]) {
      resultsDiv.textContent = "Error scanning the page.";
      return;
    }

    const mediaList = results[0].result;
    displayResults(mediaList);
  });
});

function displayResults(mediaList) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (mediaList.length === 0) {
    resultsDiv.textContent = "No media files found.";
    return;
  }

  mediaList.forEach(url => {
    const item = document.createElement('div');
    item.className = 'media-item';

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    
    // Extract filename or show shortened URL
    const filename = url.split('/').pop().split('#')[0].split('?')[0] || url;
    link.textContent = filename.length > 30 ? filename.substring(0, 27) + '...' : filename;
    link.title = url;

    const btn = document.createElement('button');
    btn.className = 'download-btn';
    btn.textContent = 'Download';
    btn.addEventListener('click', () => {
      // Create a temporary anchor element to trigger download
      const tempAnchor = document.createElement('a');
      tempAnchor.href = url;
      tempAnchor.download = '';
      document.body.appendChild(tempAnchor);
      tempAnchor.click();
      document.body.removeChild(tempAnchor);
    });

    item.appendChild(link);
    item.appendChild(btn);
    resultsDiv.appendChild(item);
  });
}