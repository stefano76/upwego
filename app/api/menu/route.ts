import { NextResponse } from 'next/server';
import { getMenuItems } from '../../../lib/menu';

export async function GET() {
  try {
    const menuItems = await getMenuItems();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error in menu API:', error);
    return NextResponse.json([], { status: 500 });
  }
}