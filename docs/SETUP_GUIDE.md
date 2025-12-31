# Setup Guide: Google Form & Apps Script Integration

This guide explains how to transition from the old Google Sheet submission method to the new structured Google Form approach.

## Step 1: Create the Google Form

1. Go to [Google Forms](https://forms.google.com) and create a new form.
2. Name it **"Web3 Games Graveyard - Game Submission"**.
3. Create the questions as defined in [FORM_SPECIFICATION.md](./FORM_SPECIFICATION.md).
   - Ensure the question titles match exactly what is in the specification (or update `scripts/Code.gs` mapping if you change them).
   - **Tip**: Use "Response validation" for the Logo URL field (Select "Text" > "URL") to ensure users submit valid links.
4. Go to the **Responses** tab in the Form editor.
5. Click **Link to Sheets** to create a new destination spreadsheet.

## Step 2: Set up the Apps Script

1. Open the newly created Google Sheet (where responses will go).
2. Go to **Extensions** > **Apps Script**.
3. Clear the default `myFunction` code.
4. Open `scripts/Code.gs` from this repository and copy the entire content.
5. Paste the code into the Apps Script editor.
6. Save the project (Ctrl+S) and name it "Web3GraveyardAPI".

## Step 3: Deploy the API

1. In the Apps Script editor, click the **Deploy** button (top right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the details:
   - **Description**: Initial deployment
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (this is crucial so the website can fetch the data without login)
4. Click **Deploy**.
5. **Copy the Web App URL** presented at the end.

## Step 4: Update the Website Configuration

1. Open `services/sheetService.ts`.
2. Replace the `SHEET_API_URL` constant with your new Web App URL:
   ```typescript
   const SHEET_API_URL = 'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec';
   ```

3. Open `components/Footer.tsx`.
4. Replace the placeholder form URL with your actual Google Form "Send" link:
   - In Google Forms, click **Send** > Link icon > Shorten URL (optional) > Copy.
   - Update the `href` in the "Update" button:
   ```tsx
   href="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform"
   ```

## Step 5: Validation

1. Submit a test response via your new Google Form.
2. Verify it appears in the Google Sheet.
3. Open your Web App URL in a browser. You should see a JSON array containing your test submission.
4. Run the website locally (`npm run dev`) and verify the new game appears in the list (you might need to refresh or clear cache).

## Notes

- **Data Delay**: Google Sheets updates are usually instant, but caching might delay visibility on the site depending on browser behavior.
- **Security**: The Apps Script is read-only for the public ("Anyone" access), but it exposes all data in the sheet. Ensure you don't collect sensitive personal info (PII) in the form.
- **Maintenance**: If you change the Form questions, remember to update the `COLUMN_MAP` in the Apps Script and redeploy (Manage deployments > Edit > New version).
