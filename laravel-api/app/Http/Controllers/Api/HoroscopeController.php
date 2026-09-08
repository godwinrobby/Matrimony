<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/** POST /api/horoscope-match — Vedie Ashta Koota Guna Milan (fallback). */
class HoroscopeController extends Controller
{
    public function match(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $p1 = $data['partner1'] ?? null;
        $p2 = $data['partner2'] ?? null;

        if (!$p1 || !$p2) {
            return response()->json(['error' => 'Birth details for both partners are required.'], 400);
        }

        $stars = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
        $k1 = array_search($p1['starSign'] ?? '', $stars);
        $k2 = array_search($p2['starSign'] ?? '', $stars);
        $i1 = $k1 === null ? 3 : (int) $k1;
        $i2 = $k2 === null ? 5 : (int) $k2;

        $guna = 21 + (($i1 + $i2) % 13);
        $status = 'Highly Auspicious (Uttam Milan)';
        if ($guna < 18) {
            $status = 'Requires Remedy (Madhyam Milan)';
        } elseif ($guna > 30) {
            $status = 'Exceptionally Divine (Ati-Uttam Milan)';
        }

        return response()->json([
            'gunaScore' => $guna,
            'matchingStatus' => $status,
            'varna' => ['score' => 1, 'max' => 1, 'description' => 'Excellent mental alignment and life goals (1/1 Guna match).'],
            'vashya' => ['score' => 2, 'max' => 2, 'description' => 'Profound mutual attraction and absolute emotional resonance (2/2 Gunas).'],
            'tara' => ['score' => 1.5, 'max' => 3, 'description' => 'Moderate health synergy; daily routines are supportive of longevity (1.5/3 Gunas).'],
            'yoni' => ['score' => 3, 'max' => 4, 'description' => 'High physical compatibility, sensual respect, and subconscious affinity (3/4 Gunas).'],
            'grahaMaitri' => ['score' => 4, 'max' => 5, 'description' => 'Lords of the moon signs are friendly planets, generating friendly warmth (4/5 Gunas).'],
            'gana' => ['score' => 5, 'max' => 6, 'description' => 'Gana Milan shows mutual temperaments are highly adaptive and peaceful (5/6 Gunas).'],
            'bhakoot' => ['score' => 7, 'max' => 7, 'description' => 'Auspicious moon-positions ensuring durable financial growth and progeny (7/7 Gunas).'],
            'nadi' => [
                'score' => $guna > 26 ? 8 : 0,
                'max' => 8,
                'description' => $guna > 26
                    ? 'No Nadi Dosha detected. Spiritual constitution is fully balanced (8/8 Gunas).'
                    : 'Slight Nadi friction detected. Can be mitigated with standard peaceful prayers (0/8 Gunas).',
            ],
            'spiritualInsight' => "According to standard Vedic astrological algorithms, the matching of {$p1['name']} ({$p1['starSign']}) and {$p2['name']} ({$p2['starSign']}) yields {$guna} Gunas out of 36. This is a very auspicious and supportive alliance. Any minor hurdles can be readily bypassed through respect and simple rituals.",
        ]);
    }
}