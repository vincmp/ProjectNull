import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeFilter = searchParams.get("active");

    const db = await getDb();
    let query: any = {};

    if (activeFilter === "true") {
      query.isActive = true;
    } else if (activeFilter === "false") {
      query.isActive = false;
    }

    const contacts = await db.collection("contacts").find(query).toArray();
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar contatos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const contactData = await request.json();

    const lastContact = await db
      .collection("contacts")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const nextId = lastContact.length > 0 ? lastContact[0].id + 1 : 1;

    const newContact = { ...contactData, id: nextId };

    const result = await db.collection("contacts").insertOne(newContact);
    return NextResponse.json({ id: nextId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar contato" },
      { status: 500 }
    );
  }
}
