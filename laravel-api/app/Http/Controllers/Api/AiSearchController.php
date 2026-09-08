<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/** POST /api/ai-search — natural-language profile search (fallback engine). */
class AiSearchController extends Controller
{
    public function search(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $query = (string) ($data['query'] ?? '');
        if ($query === '') {
            return response()->json(['error' => 'Search query is required.'], 400);
        }
        $items = $data['profiles'] ?? [];

        $q = mb_strtolower($query);
        $cities = ['mumbai','bengaluru','bangalore','delhi','pune','hyderabad','chennai','kolkata'];
        $professions = ['engineer','developer','consultant','doctor','mba','designer','architect','business','analyst','founder','manager'];

        $extracted = ['locations' => [], 'professions' => [], 'diets' => [], 'lifestyles' => []];
        foreach ($cities as $c) {
            if (str_contains($q, $c)) {
                array_push($extracted['locations'], ucfirst($c));
            }
        }
        if (str_contains($q, 'veg')) {
            array_push($extracted['diets'], 'Veg');
        }
        if (str_contains($q, 'non-veg') || str_contains($q, 'meat')) {
            array_push($extracted['diets'], 'Non-Veg');
        }
        foreach ($professions as $p) {
            if (str_contains($q, $p)) {
                array_push($extracted['professions'], ucfirst($p));
            }
        }
        if (str_contains($q, 'modern')) {
            array_push($extracted['lifestyles'], 'Modern');
        }
        if (str_contains($q, 'traditional')) {
            array_push($extracted['lifestyles'], 'Traditional');
        }

        $matches = [];
        foreach ($items as $p) {
            $profileId = (string) ($p['id'] ?? '');
            $score = 55;
            $reasons = [];

            $gender = (string) ($p['gender'] ?? '');
            if ($gender === 'Groom') {
                $score += 12;
                array_push($reasons, 'matches the groom profile sought');
            } elseif ($gender === 'Bride') {
                $score += 12;
                array_push($reasons, 'matches the bride profile sought');
            }

            $city = (string) ($p['location']['city'] ?? '');
            foreach ($extracted['locations'] as $loc) {
                if (str_contains(mb_strtolower($city), mb_strtolower($loc))) {
                    $score += 20;
                    array_push($reasons, "resides in {$city}");
                }
            }
            if (str_contains($q, 'veg') && ($p['diet'] ?? '') === 'Veg') {
                $score += 15;
                array_push($reasons, 'follows a pure vegetarian diet');
            }
            $prof = (string) ($p['profession'] ?? '');
            foreach ($extracted['professions'] as $pr) {
                if (str_contains(mb_strtolower($prof), mb_strtolower($pr))) {
                    $score += 20;
                    array_push($reasons, "works as a skilled {$prof}");
                }
            }

            $score = min(98, $score);
            array_push($matches, [
                'profileId' => $profileId,
                'score' => $score,
                'reason' => count($reasons) > 0
                    ? 'This candidate ' . implode(' and ', $reasons) . '.'
                    : 'Shares many foundational values for a harmonious union.',
            ]);
        }

        return response()->json([
            'summary' => 'Based on your natural-language preferences, here are promising candidates aligned with your goals. We encourage you to review their profiles and initiate a warm, respectful conversation.',
            'extractedCriteria' => $extracted,
            'matches' => $matches,
        ]);
    }
}