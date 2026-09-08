<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/** POST /api/daily-horoscope — personalized daily forecast (fallback). */
class DailyHoroscopeController extends Controller
{
    public function generate(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $profile = $data['profile'] ?? null;
        if (!$profile) {
            return response()->json(['error' => 'User profile is required to generate a personalized daily horoscope.'], 400);
        }

        $birthTime = $profile['birthTime'] ?? '08:00';
        $hour = (int) explode(':', (string) $birthTime)[0] ?: 8;
        $lagnaMap = [
            [5, 'Mesha (Aries)', 'Mars', 'Fire'],
            [7, 'Vrishabha (Taurus)', 'Venus', 'Earth'],
            [9, 'Mithuna (Gemini)', 'Mercury', 'Air'],
            [11, 'Karka (Cancer)', 'Moon', 'Water'],
            [13, 'Simha (Leo)', 'Sun', 'Fire'],
            [15, 'Kanya (Virgo)', 'Mercury', 'Earth'],
            [17, 'Tula (Libra)', 'Venus', 'Air'],
            [19, 'Vrishchika (Scorpio)', 'Mars', 'Water'],
            [21, 'Dhanu (Sagittarius)', 'Jupiter', 'Fire'],
            [23, 'Makara (Capricorn)', 'Saturn', 'Earth'],
        ];
        $lagna = ['name' => 'Meena (Pisces)', 'ruler' => 'Jupiter', 'element' => 'Water'];
        foreach ($lagnaMap as $m) {
            if ($hour >= $m[0]) {
                $lagna = ['name' => $m[1], 'ruler' => $m[2], 'element' => $m[3]];
            }
        }
        if ($hour >= 1 && $hour < 3) {
            $lagna = ['name' => 'Kumbha (Aquarius)', 'ruler' => 'Saturn', 'element' => 'Air'];
        }

        $rashi = $profile['rashi'] ?? 'Virgo (Kanya)';
        $nakshatra = $profile['nakshatra'] ?? 'Chitra';
        $caste = $profile['caste'] ?? 'Brahmin';

        return response()->json([
            'lagna' => $lagna,
            'chartSummary' => [
                'evaluation' => "Your birth details reveal a strong {$lagna['name']} ascendant ruled by {$lagna['ruler']}. Today, Jupiter casts a beneficial aspect on your 9th house of fortune, creating highly favorable alignments for matching.",
                'verdict' => "Highly auspicious planetary cycle. There are no critical transits or blockages. Excellent prospects for connecting with high-quality candidates of {$caste} caste.",
            ],
            'loveInsight' => [
                'title' => "{$rashi} Compatibility Forecast",
                'general' => "Today, Chandra transit aligns with your Janma Nakshatra, {$nakshatra}, raising your emotional intelligence and communication clarity. Conversations with potential matches will be highly fruitful.",
                'manglikAdvice' => ($profile['manglik'] ?? '') === 'Manglik'
                    ? 'Your Manglik strength brings passion; seek compatible profiles to ensure harmonious alignment.'
                    : 'Your peaceful Mars alignment creates beautiful harmony for a union.',
                'bestMatchCastes' => 'Compatible clans and sub-castes align well for a smooth alliance.',
                'recommendation' => "Reach out to a verified profile today; Jupiter favours the first approach.",
            ],
            'careerInsight' => [
                'title' => 'Growth & Wealth Outlook',
                'general' => 'Your professional trajectory remains stable with steady growth on the horizon.',
                'wealth' => 'Prudent financial direction benefits the household and upcoming commitments.',
                'remedy' => 'Offer Surya Arghya (water to the rising sun) each morning to clear subtle blocks.',
            ],
            'muhurats' => [
                ['name' => 'Abhijit Muhurat', 'time' => '11:45 AM - 12:35 PM', 'status' => 'Excellent', 'action' => 'Ideal window for first conversations', 'icon' => 'Sun'],
                ['name' => 'Vijaya Muhurat', 'time' => '3:00 PM - 4:00 PM', 'status' => 'Auspicious', 'action' => 'Good time to share proposals', 'icon' => 'Moon'],
            ],
            'grahaBala' => [
                ['name' => 'Surya (Sun)', 'score' => 82, 'color' => 'bg-orange-600', 'desc' => 'Strong vitality today'],
                ['name' => 'Chandra (Moon)', 'score' => 76, 'color' => 'bg-sky-400', 'desc' => 'Emotional clarity rising'],
                ['name' => 'Guru (Jupiter)', 'score' => 90, 'color' => 'bg-amber-500', 'desc' => 'Highly favourable aspect'],
            ],
        ]);
    }
}