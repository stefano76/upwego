import { NextResponse } from 'next/server';
import { getMenuItems } from '@/lib/menu';

export async function GET() {
  try {
    const menuItems = await getMenuItems();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json([], { status: 500 });
  }
}
