<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Matchmaking / astrology endpoints.
 * Uses deterministic fallback logic (no external AI dependency), mirroring
 * the previous Node.js server/routes behaviour.
 */
class MatchmakingController extends Controller
{
    /** POST /api/compatibility */
    public function compatibility(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $p1 = $data['profile1'] ?? null;
        $p2 = $data['profile2'] ?? null;
        if (!$p1 || !$p2) {
            return response()->json(['error' => 'Two profiles are required for compatibility analysis.'], 400);
        }

        $sameDiet = ($p1['diet'] ?? '') === ($p2['diet'] ?? '');
        $sameValues = ($p1['familyValues'] ?? '') === ($p2['familyValues'] ?? '');
        $sameLifestyle = ($p1['lifestyle'] ?? '') === ($p2['lifestyle'] ?? '');

        $base = 75 + ($sameDiet ? 8 : 2) + ($sameValues ? 10 : 3) + ($sameLifestyle ? 7 : 2);
        $final = min(98, max(60, $base));

        return response()->json([
            'overallScore' => $final,
            'dimensions' => [
                'personality' => [
                    'score' => min(100, $final + 3),
                    'analysis' => "{$p1['name']}'s progressive outlook blends gracefully with {$p2['name']}'s hobbies. They both express emotional maturity, creating a smooth conversational dynamic.",
                ],
                'lifestyle' => [
                    'score' => $sameLifestyle ? 95 : 80,
                    'analysis' => 'Both individuals lead ' .
                        ($p1['lifestyle'] === 'Modern' ? 'highly active, modern' : 'balanced, values-oriented') .
                        " lives. {$p1['name']}'s food preference ({$p1['diet']}) and {$p2['name']}'s food preference ({$p2['diet']}) present " .
                        ($sameDiet ? 'complete alignment.' : 'a respectful boundary they both comfortably accommodate.'),
                ],
                'career' => [
                    'score' => 90,
                    'analysis' => "{$p1['name']} (working as {$p1['profession']}) and {$p2['name']} ({$p2['profession']}) share high educational foundations, enabling strong intellectual camaraderie.",
                ],
                'family' => [
                    'score' => $sameValues ? 92 : 78,
                    'analysis' => "With {$p1['familyValues']} family values on {$p1['name']}'s side and {$p2['familyValues']} on {$p2['name']}'s, their mutual respect for traditional parents ensures smooth family integrations.",
                ],
            ],
            'synergySummary' => "A beautiful and highly compatible match! {$p1['name']} and {$p2['name']} exhibit profound synergy across educational goals, lifestyle choices, and essential family virtues. Their mutual emotional intelligence can foster a supportive household.",
            'growthAreas' => "While highly compatible, standard differences in mother tongues ({$p1['motherTongue']} & {$p2['motherTongue']}) are a bridge to celebrate and learn. Open dialogues around regional routines will enrich their union.",
        ]);
    }
}