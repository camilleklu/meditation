<?php

use App\Models\Audio;
use App\Models\Article;
use App\Models\Workshop;
use Illuminate\Support\Str;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/audios', function () {
    return Audio::all()->map(function ($audio) {

        if (!Str::startsWith($audio->src, ['http://', 'https://'])) {
            $filename = basename($audio->src);
            $audio->src = route('audio.stream', ['filename' => $filename]);
        }

        if ($audio->img && !Str::startsWith($audio->img, ['http://', 'https://'])) {
            $audio->img = asset('storage/' . $audio->img);
        }

        if ($audio->video && !Str::startsWith($audio->video, ['http://', 'https://'])) {
            $audio->video = asset('storage/' . $audio->video);
        }

        return $audio;
    });
});

Route::get('/articles', function () {
    return Article::all()->map(function ($article) {
        if (!Str::startsWith($article->img, ['http://', 'https://'])) {
            $article->img = asset('storage/' . $article->img);
        }
        return $article;
    });
});

Route::get('/workshops', function () {
    return Workshop::orderBy('date', 'asc')->get()->map(function ($workshop) {
        if (!Str::startsWith($workshop->img, ['http://', 'https://'])) {
            $workshop->img = asset('storage/' . $workshop->img);
        }
        return $workshop;
    });
});

Route::post('/workshops/{id}/register', function (Request $request, $id) {

    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email',
        'phone' => 'required|string',
    ]);

    $workshop = Workshop::find($id);

    if (!$workshop) {
        return response()->json(['message' => 'Atelier introuvable'], 404);
    }

    if ($workshop->spots <= 0) {
        return response()->json(['message' => 'Désolé, cet atelier est complet !'], 400);
    }

    Registration::create([
        'workshop_id' => $workshop->id,
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
    ]);

    $workshop->decrement('spots');

    return response()->json([
        'message' => 'Inscription validée !',
        'remaining_spots' => $workshop->spots
    ]);
});