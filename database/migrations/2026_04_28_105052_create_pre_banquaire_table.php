<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pre_banquaire', function (Blueprint $table) {
            $table->id();
            $table->string('nom_client');
            $table->string('nom_banque');
            $table->decimal('montant', 15, 2);
            $table->decimal('taux', 5, 2);
            $table->decimal('montant_a_rembourser', 15, 2);
            $table->date('date_du_pret');
            $table->integer('duree');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pre_banquaire');
    }
};
