<?php

namespace App\Filament\Resources\Articles;

use App\Models\Article;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Radio;
use Filament\Support\Icons\Heroicon;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Utilities\Get;
use App\Filament\Resources\Articles\Pages\EditArticle;
use App\Filament\Resources\Articles\Pages\ListArticles;
use App\Filament\Resources\Articles\Pages\CreateArticle;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;
    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Contenu de l\'article')->schema([
                TextInput::make('title')->required()->label('Titre'),

                // Champs spécifiques à ta migration
                Select::make('category')
                    ->options(['Conseils' => 'Conseils', 'Nutrition' => 'Nutrition', 'Éveil' => 'Éveil', 'Témoignages' => 'Témoignages'])
                    ->required()
                    ->label('Catégorie'),
                TextInput::make('author')->required()->label('Auteur'),
                DatePicker::make('date')->required()->label('Date de publication'),

                Textarea::make('excerpt')
                    ->rows(3)
                    ->required()
                    ->label('Court résumé (Excerpt)'),

                RichEditor::make('content') // RichEditor pour écrire de jolis articles
                    ->required()
                    ->label('Contenu complet'),
            ]),

            // --- GESTION DE L'IMAGE (IMG) ---
            Section::make('Image de couverture')->schema([
                Radio::make('img_type')
                    ->label('Source Image')
                    ->options(['local' => 'Upload Image', 'url' => 'Lien URL'])
                    ->default('local')
                    ->live()
                    ->dehydrated(false),

                // Cas 1 : Upload Local
                FileUpload::make('img')
                    ->directory('articles_images') // Dossier spécifique pour ranger
                    ->visible(fn(Get $get) => $get('img_type') === 'local')
                    ->required(fn(Get $get) => $get('img_type') === 'local')
                    ->dehydrated(fn(Get $get) => $get('img_type') === 'local'),


                // Cas 2 : URL
                TextInput::make('img')
                    ->label('Lien URL Image')
                    ->url()
                    ->placeholder('https://...')
                    ->visible(fn(Get $get) => $get('img_type') === 'url')
                    ->required(fn(Get $get) => $get('img_type') === 'url')
                    ->dehydrated(fn(Get $get) => $get('img_type') === 'url')
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make('img')->square()->label('Image'),
            TextColumn::make('title')->searchable()->sortable()->limit(30),
            TextColumn::make('author')->sortable(),
            TextColumn::make('category')->badge(),
            TextColumn::make('date')->date(),
        ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListArticles::route('/'),
            'create' => CreateArticle::route('/create'),
            'edit' => EditArticle::route('/{record}/edit'),
        ];
    }
}