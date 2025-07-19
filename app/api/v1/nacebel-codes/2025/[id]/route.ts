// app/api/v1/nacebel-codes/2025/[id]/route.ts
import { NextResponse } from "next/server"
import { getNacebelCodeDetails } from "@/lib/nacebelData"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface NacebelCodeDetailParams {
  params: {
    id: string // This will be the id without dots
  }
}

export async function GET(request: Request, { params }: NacebelCodeDetailParams) {
  try {
    const { id } = params // id is the dot-less code from the URL

    if (!id) {
      return NextResponse.json({ error: "Code ID is required." }, { status: 400, headers: corsHeaders })
    }

    const codeDetails = await getNacebelCodeDetails(id)

    if (!codeDetails) {
      return NextResponse.json({ error: "NACEBEL code not found." }, { status: 404, headers: corsHeaders })
    }

    // The getNacebelCodeDetails function now returns PublicNacebelCode,
    // which already includes the empty description and handles children.
    return NextResponse.json(codeDetails, { headers: corsHeaders })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}
