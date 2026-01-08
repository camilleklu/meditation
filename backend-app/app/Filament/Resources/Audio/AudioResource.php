<?php

namespace App\Filament\Resources\Audio;

use App\Models\Audio;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Utilities\Get;
use App\Filament\Resources\Audio\Pages\EditAudio;
use App\Filament\Resources\Audio\Pages\ListAudio;
use App\Filament\Resources\Audio\Pages\CreateAudio;

class AudioResource extends Resource
{
    protected static ?string $model = Audio::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informations')->schema([
                TextInput::make('title')->required()->label('Titre'),
                Select::make('category')
                    ->options(['Ambiances' => 'Ambiances', 'Podcast' => 'Podcast', 'Histoires' => 'Histoires', 'Autre' => 'Autre'])
                    ->required(),
            ]),

            // --- GESTION DU SON (SRC) ---
            Section::make('Fichier Audio')->schema([
                Radio::make('src_type')
                    ->label('Source Audio')
                    ->options(['local' => 'Upload MP3', 'url' => 'Lien URL'])
                    ->default('local')
                    ->live()
                    ->dehydrated(false),

                // Cas 1 : Upload Local
                FileUpload::make('src')
                    ->label('Fichier')
                    ->directory('audios')
                    ->acceptedFileTypes(['audio/mpeg', 'audio/mp3', 'audio/wav'])
                    ->visible(fn(Get $get) => $get('src_type') === 'local')
                    ->required(fn(Get $get) => $get('src_type') === 'local')
                    ->dehydrated(fn(Get $get) => $get('src_type') === 'local'),

                // Cas 2 : URL
                TextInput::make('src')
                    ->label('Lien URL')
                    ->url()
                    ->placeholder('https://...')
                    ->visible(fn(Get $get) => $get('src_type') === 'url')
                    ->required(fn(Get $get) => $get('src_type') === 'url')
                    ->dehydrated(fn(Get $get) => $get('src_type') === 'url'),

            ]),

            // --- GESTION DE L'IMAGE (IMG) ---
            Section::make('Visuel')->schema([
                Radio::make('img_type')
                    ->label('Source Image')
                    ->options(['local' => 'Upload Image', 'url' => 'Lien URL'])
                    ->default('local')
                    ->live()
                    ->dehydrated(false),

                // Cas 1 : Upload Local
                FileUpload::make('img')
                    ->label('Image')
                    ->directory('images')
                    ->visible(fn(Get $get) => $get('img_type') === 'local')
                    ->required(fn(Get $get) => $get('img_type') === 'local')
                    ->dehydrated(fn(Get $get) => $get('img_type') === 'local'),

                // Cas 2 : URL
                TextInput::make('img')
                    ->label('Lien URL Image')
                    ->url()
                    ->visible(fn(Get $get) => $get('img_type') === 'url')
                    ->required(fn(Get $get) => $get('img_type') === 'url')
                    ->dehydrated(fn(Get $get) => $get('img_type') === 'url'),
            ]),


            Section::make('Vidéo de fond (Optionnel)')->schema([
                FileUpload::make('video')
                    ->label('Fichier Vidéo (MP4)')
                    ->helperText('Idéalement une boucle courte (loop) de moins de 10Mo.')
                    ->directory('videos') // Stocké dans storage/app/public/videos
                    ->acceptedFileTypes(['video/mp4'])
                    ->maxSize(50000) // 50 Mo max (large)
                    ->downloadable()
                    ->columnSpanFull(), // Prend toute la largeur
            ]),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make('img')->square()->label('Cover'),
            TextColumn::make('title')->searchable()->sortable(),
            TextColumn::make('category')->badge(),
        ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    // ... Garde tes fonctions getPages() comme avant ...
    public static function getPages(): array
    {
        return [
            'index' => ListAudio::route('/'),
            'create' => CreateAudio::route('/create'),
            'edit' => EditAudio::route('/{record}/edit'),
        ];
    }
}