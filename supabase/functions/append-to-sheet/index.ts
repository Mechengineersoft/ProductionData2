import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SheetEntry {
  machine: string;
  date: string;
  shift: string;
  block: string;
  part: string;
  thkCm: string;
  nos: string;
  finish: string;
  lCm: string;
  hCm: string;
  colour: string;
  remarks: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  h7: string;
  h8: string;
  h9: string;
  h10: string;
  h11: string;
  h12: string;
  h13: string;
  h14: string;
  h15: string;
  h16: string;
  h17: string;
}

// Get access token using service account
async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccountKey.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Base64URL encode
  const base64UrlEncode = (obj: any) => {
    const json = JSON.stringify(obj);
    const base64 = btoa(json);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const headerB64 = base64UrlEncode(header);
  const claimB64 = base64UrlEncode(claim);
  const signatureInput = `${headerB64}.${claimB64}`;

  // Import the private key and sign
  const privateKeyPem = serviceAccountKey.private_key;
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const jwt = `${signatureInput}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  
  if (!tokenResponse.ok) {
    console.error('Token exchange error:', tokenData);
    throw new Error(`Failed to get access token: ${tokenData.error_description || tokenData.error}`);
  }

  return tokenData.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountKeyStr = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKeyStr) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
    }

    const serviceAccountKey = JSON.parse(serviceAccountKeyStr);
    const { entries } = await req.json() as { entries: SheetEntry[] };

    if (!entries || entries.length === 0) {
      throw new Error('No entries provided');
    }

    console.log(`Processing ${entries.length} entries`);

    // Get access token
    const accessToken = await getAccessToken(serviceAccountKey);
    console.log('Access token obtained successfully');

    // Prepare rows for Google Sheets
    const rows = entries.map((entry) => [
      entry.machine,
      entry.date,
      entry.shift,
      entry.block,
      entry.part,
      entry.thkCm,
      entry.nos,
      entry.finish,
      entry.lCm,
      entry.hCm,
      entry.colour,
      entry.remarks,
      entry.h1,
      entry.h2,
      entry.h3,
      entry.h4,
      entry.h5,
      entry.h6,
      entry.h7,
      entry.h8,
      entry.h9,
      entry.h10,
      entry.h11,
      entry.h12,
      entry.h13,
      entry.h14,
      entry.h15,
      entry.h16,
      entry.h17,
    ]);

    const SPREADSHEET_ID = '1yVlYmkSlvuSWA_XkVGtyR9V1dPmc1kJvhA1QI-kZGpA';
    const SHEET_NAME = 'Data';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:AC:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Google Sheets API Error:', responseData);
      throw new Error(responseData.error?.message || 'Failed to append data to Google Sheets');
    }

    console.log('Data appended successfully:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully appended ${entries.length} rows`,
        updatedRange: responseData.updates?.updatedRange 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in append-to-sheet function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
