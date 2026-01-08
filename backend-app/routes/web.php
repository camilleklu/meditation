<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/stream-audio/{filename}', function ($filename) {
    // 1. On reconstruit le chemin complet vers le fichier
    // Attention : on suppose que tes fichiers sont dans 'audios/'
    $path = 'audios/' . $filename;

    // 2. Vérification que le fichier existe
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    // 3. On demande à Laravel de servir le fichier (il ajoutera les headers CORS automatiquement)
    return Storage::disk('public')->response($path);
})->where('filename', '.*')->name('audio.stream');