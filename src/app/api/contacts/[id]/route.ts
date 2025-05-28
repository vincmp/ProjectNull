import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const contactData = await request.json();
    const { id, ...updateData } = contactData;

    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const numericId = parseInt(idParam || "");

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const result = await db
      .collection("contacts")
      .updateOne({ id: numericId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Contato não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Contato atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar contato" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();

    const url = new URL(request.url);
    const idParam = url.pathname.split("/").pop();
    const numericId = parseInt(idParam || "");

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const result = await db.collection("contacts").deleteOne({ id: numericId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Contato não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Contato excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir contato:", error);
    return NextResponse.json(
      { error: "Erro ao excluir contato" },
      { status: 500 }
    );
  }
}
