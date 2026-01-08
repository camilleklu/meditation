<?php

namespace App\Filament\Resources\Workshops\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;

class WorkshopForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                DatePicker::make('date')
                    ->required(),
                TimePicker::make('time')
                    ->required(),
                TextInput::make('location')
                    ->required(),
                TextInput::make('spots')
                    ->required()
                    ->numeric(),
                Textarea::make('img')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
