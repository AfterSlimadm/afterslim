import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Arquivo excede o limite de 10MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Tipo de arquivo nao permitido. Aceitos: PDF, PNG, JPG, WEBP, DOC, DOCX, XLS, XLSX.",
        },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Build a unique path: {folder}/{timestamp}-{filename}
    const folder = (formData.get("folder") as string) || "transactions";
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${timestamp}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload]", uploadError.message);
      return NextResponse.json(
        { error: "Erro ao fazer upload: " + uploadError.message },
        { status: 500 }
      );
    }

    // Create a signed URL valid for 1 year (for long-term access)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("attachments")
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    if (signedError) {
      console.error("[upload signed url]", signedError.message);
      return NextResponse.json(
        { error: "Erro ao gerar URL do arquivo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: signedData.signedUrl,
      path: filePath,
      name: file.name,
    });
  } catch (err) {
    console.error("[upload] unexpected error", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
