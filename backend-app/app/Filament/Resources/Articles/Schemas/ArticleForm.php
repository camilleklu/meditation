<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('category')
                    ->required(),
                TextInput::make('author')
                    ->required(),
                DatePicker::make('date')
                    ->required(),
                TextInput::make('excerpt')
                    ->required(),
                TextInput::make('content')
                    ->required(),
                Textarea::make('img')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
