<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Chat + payment helper endpoints (deterministic fallbacks).
 */
class AssistantController extends Controller
{
    /** POST /api/pundit-chat */
    public function punditChat(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $messages = $data['messages'] ?? null;
        if (!$messages || !is_array($messages)) {
            return response()->json(['error' => 'A valid list of messages is required.'], 400);
        }
        $last = is_array($messages) && count($messages) > 0 ? end($messages) : [];
        $msg = (string) ($last['text'] ?? '');
        $lower = mb_strtolower($msg);

        if (str_contains($lower, 'horoscope') || str_contains($lower, 'kundli') || str_contains($lower, 'guna')) {
            $reply = 'Namaste! Horoscope matching (Kundli Milan) is highly esteemed as it studies the planetary alignment of the couple. While Guna Milan (matching out of 36 points) provides spiritual coordinates, I always advise modern couples to also assess lifestyle, professional respect, and intellectual synchronization.';
        } elseif (str_contains($lower, 'manglik') || str_contains($lower, 'mangal')) {
            $reply = "Namaste! Being Manglik (influence of planet Mars/Mangal) is a common astrological condition in Hindu charts. It represents passion, energy, and determination. Many Manglik individuals marry happily by doing simple prayers or choosing a compatible partner who understands their dynamic nature. Don't worry, true love and understanding always conquer stellar friction!";
        } elseif (str_contains($lower, 'success') || str_contains($lower, 'story') || str_contains($lower, 'marry')) {
            $reply = "Indeed, our platform has united countless families. By combining our high-fidelity verification with our modern AI matchmaking engine, we ensure every interaction is trustworthy and delightful. Would you like to check compatibility with one of our featured profiles?";
        } else {
            $reply = "Namaste! Marriage is a sacred union of two families and souls. Focus on mutual respect, trust, and alignment of values. When talking to potential partners, focus on their life goals, interest in family care, and career dreams. How can I assist you with Guna matching or matrimonial rituals today?";
        }

        return response()->json(['text' => $reply]);
    }

    /** POST /api/profile-chat */
    public function profileChat(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $profile = $data['profile'] ?? null;
        $messages = $data['messages'] ?? null;
        if (!$profile || !$messages || !is_array($messages)) {
            return response()->json(['error' => 'Profile and message history are required.'], 400);
        }

        $responses = [
            "Thanks for reaching out! I was just reading your profile and found it really interesting. What hobbies keep you busy during weekends?",
            "Hello! It's great to connect. Yes, working as {$profile['profession']} in {$profile['location']['city']} keeps my days active. I'd love to know more about your lifestyle and what you value most in a partner.",
            "Namaste! My parents and I really appreciate your interest. Family is very important to us. How do you usually balance career goals and spending quality family time?",
            'That sounds lovely! I believe mutual respect and good food (' .
                ($profile['diet'] === 'Veg' ? 'traditional vegetarian dishes' : 'exploring various cuisines') .
                ") make for great foundation blocks. Let's keep talking!",
        ];
        $idx = count($messages) % count($responses);

        return response()->json(['text' => $responses[$idx]]);
    }

    /** POST /api/cashfree/create-order */
    public function createOrder(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $amount = $data['amount'] ?? 299;
        $orderId = 'CF_ORD_' . str(rand(100000, 999999)) . '_' . str(time() % 10000);

        return response()->json([
            'success' => true,
            'orderId' => $orderId,
            'paymentSessionId' => 'session_mock_' . bin2hex(random_bytes(5)),
            'isMock' => true,
        ]);
    }

    /** POST /api/cashfree/verify-payment */
    public function verifyPayment(Request $request)
    {
        $orderId = $request->json('orderId');
        return response()->json(['success' => true, 'orderId' => $orderId, 'status' => 'SUCCESS']);
    }
}