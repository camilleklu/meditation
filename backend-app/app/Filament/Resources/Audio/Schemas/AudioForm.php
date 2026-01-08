<?php

namespace App\Filament\Resources\Audio\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AudioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('category')
                    ->required(),
                Textarea::make('src')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('img')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
