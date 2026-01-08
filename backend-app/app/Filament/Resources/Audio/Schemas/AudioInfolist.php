<?php

namespace App\Filament\Resources\Audio\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class AudioInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('title'),
                TextEntry::make('category'),
                TextEntry::make('src')
                    ->columnSpanFull(),
                TextEntry::make('img')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
