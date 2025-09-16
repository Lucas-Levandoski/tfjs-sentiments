import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for messages (in production, use a database)
let messages: Array<{
  id: string;
  content: string;
}> = [];

// GET /api/messages - Retrieve all messages
export async function GET() {
  try {
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Add a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content: content.trim(),
    };

    messages.push(newMessage);

    return NextResponse.json(
      { message: 'Message added successfully', data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages - Clear all messages (optional utility)
export async function DELETE() {
  try {
    messages = [];
    return NextResponse.json(
      { message: 'All messages cleared' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear messages' },
      { status: 500 }
    );
  }
}