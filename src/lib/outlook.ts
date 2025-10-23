// File: src/lib/outlook.ts

import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import { prisma } from './prisma';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    // Use 'common' for multi-tenant support (allows any Microsoft account)
    // Use 'organizations' for any organizational account
    // Use 'consumers' for personal Microsoft accounts only
    authority: `https://login.microsoftonline.com/common`,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
  },
};

const msalClient = new ConfidentialClientApplication(msalConfig);

export async function getAuthUrl() {
  const authCodeUrlParameters = {
    scopes: ['https://graph.microsoft.com/Mail.Read', 'offline_access'],
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlook/auth`,
  };
  return await msalClient.getAuthCodeUrl(authCodeUrlParameters);
}

export async function getTokenFromCode(code: string) {
  const tokenRequest = {
    code,
    scopes: ['https://graph.microsoft.com/Mail.Read', 'offline_access'],
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlook/auth`,
  };
  return await msalClient.acquireTokenByCode(tokenRequest);
}

export async function getAccessToken() {
  const token = await prisma.outlookToken.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!token) throw new Error('No token found');

  if (new Date() > token.expiresAt) {
    const refreshRequest = {
      refreshToken: token.refreshToken,
      scopes: ['https://graph.microsoft.com/Mail.Read'],
    };
    const response = await msalClient.acquireTokenByRefreshToken(refreshRequest);
    
    await prisma.outlookToken.create({
      data: {
        accessToken: response!.accessToken,
        refreshToken: response!.refreshToken || token.refreshToken,
        expiresAt: new Date(Date.now() + (response!.expiresIn || 3600) * 1000),
      },
    });
    
    return response!.accessToken;
  }

  return token.accessToken;
}

export async function getGraphClient() {
  const accessToken = await getAccessToken();
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

export async function fetchEmails() {
  const client = await getGraphClient();
  const messages = await client
    .api('/me/messages')
    .filter("from/emailAddress/address eq 'donotreply@commercecontrol.com' and startswith(subject, 'prod: Error')")
    .top(50)
    .orderby('receivedDateTime desc')
    .get();
  
  return messages.value;
}

export function parseErrorEmail(email: any) {
  const subject = email.subject;
  const body = email.body.content;
  
  const errorTypeMatch = subject.match(/prod: Error - (.+)/);
  const errorType = errorTypeMatch ? errorTypeMatch[1].trim() : 'Unknown Error';
  
  const errorMessageMatch = body.match(/There is a problem with the following job[^\.]*\.\s*([^\.]+)/);
  const errorMessage = errorMessageMatch ? errorMessageMatch[1].trim() : body.substring(0, 200);
  
  return {
    subject,
    errorType,
    errorMessage,
    fullBody: body,
    receivedAt: new Date(email.receivedDateTime),
  };
}