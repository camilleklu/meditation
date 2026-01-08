<?php

namespace App\Filament\Resources\Workshops;
use App\Models\Workshop;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Components\Utilities\Get;
use App\Filament\Resources\Workshops\Pages\EditWorkshop;
use App\Filament\Resources\Workshops\Pages\ListWorkshops;
use App\Filament\Resources\Workshops\Pages\CreateWorkshop;

class WorkshopResource extends Resource
{
    protected static ?string $model = Workshop::class;
    protected static ?string $navigationLabel = 'Ateliers';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Détails de l\'atelier')->schema([
                    TextInput::make('title')->required()->label('Titre'),
                    TextInput::make('location')->required()->label('Lieu'),

                    // Gestion Date et Heure
                    DatePicker::make('date')->required()->label('Date'),
                    TimePicker::make('time')->required()->label('Heure'),

                    // Nombre de places
                    TextInput::make('spots')
                        ->numeric()
                        ->required()
                        ->label('Places disponibles')
                        ->default(10),

                    Textarea::make('description')->required()->rows(3),
                ]),

                // --- GESTION IMAGE (Comme pour Audio/Article) ---
                Section::make('Visuel')->schema([
                    Radio::make('img_type')
                        ->label('Source Image')
                        ->options(['local' => 'Upload Image', 'url' => 'Lien URL'])
                        ->default('local')
                        ->live()
                        ->dehydrated(false),

                    FileUpload::make('img')
                        ->directory('workshops')
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                        ->visible(fn(Get $get) => $get('img_type') === 'local')
                        ->required(fn(Get $get) => $get('img_type') === 'local')
                        ->dehydrated(fn(Get $get) => $get('img_type') === 'local'),

                    TextInput::make('img')
                        ->label('Lien URL Image')
                        ->url()
                        ->placeholder('https://...')
                        ->visible(fn(Get $get) => $get('img_type') === 'url')
                        ->required(fn(Get $get) => $get('img_type') === 'url')
                        ->dehydrated(fn(Get $get) => $get('img_type') === 'url'),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('img')->square()->label('Image'),
                TextColumn::make('title')->sortable()->searchable(),
                TextColumn::make('date')->date('d/m/Y')->sortable(),
                TextColumn::make('spots')->label('Places')->badge()->color(fn($state) => $state > 0 ? 'success' : 'danger'),
                TextColumn::make('location'),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWorkshops::route('/'),
            'create' => CreateWorkshop::route('/create'),
            'edit' => EditWorkshop::route('/{record}/edit'),
        ];
    }
}