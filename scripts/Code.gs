/**
 * Web3 Games Graveyard - Apps Script Backend
 * 
 * Instructions:
 * 1. Create a Google Form based on the specification.
 * 2. Link the Form to a Google Sheet (Responses).
 * 3. Open the Sheet, go to Extensions > Apps Script.
 * 4. Paste this code into Code.gs.
 * 5. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Select "Web app"
 *    - Description: "v1"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (to allow your site to fetch data)
 *    - Click "Deploy" and copy the Web App URL.
 */

// Mapping of Form Question Titles to JSON Property Names
const COLUMN_MAP = {
  'Timestamp': 'lastUpdated',
  'Game Name': 'name',
  'Game Status': 'status',
  'Description': 'description',
  'Reason for Demise': 'reasonForDemise',
  'Cause of Shutdown': 'reasonForDemise', 
  'Launch Date': 'launchDate',
  'Death Date': 'deathDate',
  'End Date': 'deathDate',
  'Logo URL': 'logoUrl',
  'Logo Link': 'logoUrl',
  'Category': 'category',
  'Game Genre': 'category',
  'Twitter Handle': 'twitterHandle',
  'X Handle': 'twitterHandle',
  'Twitter X': 'twitterHandle',
  'Blockchain': 'blockchain',
  'Developer': 'developer',
  'Funding Raised': 'fundingRaised',
  'Funding': 'fundingRaised',
  'Peak Players': 'peakPlayers',
  'Source / Reference': 'source',
  'Official Website': 'source',
  'Tags': 'tags',
  'Your Name / Handle': 'addedBy',
  'Your Name': 'addedBy'
};

function doGet(e) {
  const data = getGameData();
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getGameData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // Assumes first sheet is responses
  const data = sheet.getDataRange().getValues();
  
  if (data.length < 2) return []; // No data
  
  const headers = data[0].map(h => String(h).trim()); // Boost: Trim headers
  const rows = data.slice(1);
  
  const games = rows.map((row, index) => {
    const game = {
      id: `sheet-${index}`, // Generate a unique ID
      verified: false // Default verified status for community submissions
    };
    
    headers.forEach((header, i) => {
      const key = COLUMN_MAP[header] || header; // Use mapped key or original header
      let value = row[i];
      
      // Handle dates
      if (value instanceof Date) {
        value = value.toISOString();
      }
      
      // Clean up strings
      if (value !== null && value !== undefined) {
        value = String(value).trim();
      }
      
      // Only add if key is known or we want to keep all columns
      if (Object.values(COLUMN_MAP).includes(key)) {
         game[key] = value;
      }
    });

    return game;
  });

  // Filter out empty rows (where name is missing)
  return games.filter(g => g.name && g.name !== 'undefined' && g.name !== 'null');
}

// Test function to run in the editor
function testGetData() {
  const data = getGameData();
  Logger.log(JSON.stringify(data, null, 2));
}
