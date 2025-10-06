import { getContactFormTexts } from "@/lib/contact-form-texts";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const texts = getContactFormTexts();
    return NextResponse.json(texts);
  } catch (error) {
    console.error('Error in API route /api/contact-form-texts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
