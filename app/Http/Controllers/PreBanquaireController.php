<?php

namespace App\Http\Controllers;

use App\Models\PreBanquaire;
use Illuminate\Http\Request;

class PreBanquaireController extends Controller
{
    // Liste tous les prêts
    public function index()
    {
        $prets = PreBanquaire::orderBy('created_at', 'desc')->get();
        return response()->json($prets);
    }

    // Ajouter un prêt
    public function store(Request $request)
    {
        $request->validate([
            'nom_client'          => 'required|string|max:100',
            'nom_banque'          => 'required|string|max:100',
            'montant'             => 'required|numeric|min:0',
            'taux'                => 'required|numeric|min:0',
            'montant_a_rembourser'=> 'required|numeric|min:0',
            'date_du_pret'        => 'required|date',
            'duree'               => 'required|integer|min:1',
        ]);

        $pret = PreBanquaire::create([
            'nom_client'           => $request->nom_client,
            'nom_banque'           => $request->nom_banque,
            'montant'              => $request->montant,
            'taux'                 => $request->taux,
            'montant_a_rembourser' => $request->montant_a_rembourser,
            'date_du_pret'         => $request->date_du_pret,
            'duree'                => $request->duree,
        ]);

        return response()->json([
            'message' => 'Prêt ajouté avec succès !',
            'pret'    => $pret,
        ], 201);
    }

    // Modifier un prêt
    public function update(Request $request, $id)
    {
        $pret = PreBanquaire::findOrFail($id);

        $request->validate([
            'nom_client'          => 'required|string|max:100',
            'nom_banque'          => 'required|string|max:100',
            'montant'             => 'required|numeric|min:0',
            'taux'                => 'required|numeric|min:0',
            'montant_a_rembourser'=> 'required|numeric|min:0',
            'date_du_pret'        => 'required|date',
            'duree'               => 'required|integer|min:1',
        ]);

        $pret->update([
            'nom_client'           => $request->nom_client,
            'nom_banque'           => $request->nom_banque,
            'montant'              => $request->montant,
            'taux'                 => $request->taux,
            'montant_a_rembourser' => $request->montant_a_rembourser,
            'date_du_pret'         => $request->date_du_pret,
            'duree'                => $request->duree,
        ]);

        return response()->json([
            'message' => 'Prêt modifié avec succès !',
            'pret'    => $pret,
        ]);
    }

    // Supprimer un prêt
    public function destroy($id)
    {
        $pret = PreBanquaire::findOrFail($id);
        $pret->delete();

        return response()->json([
            'message' => 'Prêt supprimé avec succès !',
        ]);
    }
}
