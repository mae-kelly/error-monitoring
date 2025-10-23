import { NextResponse } from 'next/server';
import { fetchEmails, parseErrorEmail } from '@/lib/outlook';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const emails = await fetchEmails();
    
    for (const email of emails) {
      const parsed = parseErrorEmail(email);
      
      const existing = await prisma.error.findFirst({
        where: {
          subject: parsed.subject,
          receivedAt: parsed.receivedAt,
        },
      });
      
      if (!existing) {
        await prisma.error.create({
          data: parsed,
        });
      }
    }
    
    return NextResponse.json({ success: true, count: emails.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}