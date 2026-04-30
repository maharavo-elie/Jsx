<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreBanquaire extends Model
{
    protected $table = 'pre_banquaire';

    protected $fillable = [
        'nom_client',
        'nom_banque',
        'montant',
        'taux',
        'montant_a_rembourser',
        'date_du_pret',
        'duree',
    ];
}
