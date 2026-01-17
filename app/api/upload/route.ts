import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Vérifier si on est en environnement Vercel (système de fichiers en lecture seule)
const isVercel = process.env.VERCEL === '1';

export async function POST(request: NextRequest) {
  try {
    // En production sur Vercel, le système de fichiers est en lecture seule
    // Retourner un message indiquant d'utiliser une URL externe
    if (isVercel) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'L\'upload de fichiers n\'est pas disponible en production. Veuillez utiliser une URL d\'image externe (Cloudinary, Imgur, etc.)' 
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Le fichier est trop volumineux. Maximum 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    
    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Créer le dossier s'il n'existe pas
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Le dossier existe déjà
    }
    
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}
