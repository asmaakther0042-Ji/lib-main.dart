import 'dart:convert';
import 'package:http/http.dart' as http;

class AiService {
  static const endpoint = String.fromEnvironment('DEEN_AI_ENDPOINT');

  static Future<String> ask(String message) async {
    if (endpoint.isEmpty) {
      return _demoReply(message);
    }

    try {
      final response = await http
          .post(
            Uri.parse(endpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'message': message}),
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data is Map && data['reply'] is String) {
          return data['reply'] as String;
        }
      }

      return 'The AI service is temporarily unavailable. Please try again.';
    } catch (_) {
      return 'I could not connect to the AI service right now. Please check your connection and try again.';
    }
  }

  static String _demoReply(String message) {
    final q = message.toLowerCase();

    if (q.contains('salah') || q.contains('namaz')) {
      return 'For Salah-related questions, DEEN AI can provide educational information, but specific rulings should be checked with reliable Islamic sources or a qualified scholar.';
    }

    if (q.contains('dua') || q.contains('doa')) {
      return 'I can help explain the meaning, context and source of a Dua. For exact Arabic wording and references, please verify with a reliable source.';
    }

    if (q.contains('quran')) {
      return 'I can help you study Quran topics, explain general concepts and organize learning. Please verify quotations and translations against a trusted Quran source.';
    }

    return 'I received your question: "$message". The app is currently running in demo mode. Once a secure AI endpoint is connected, this screen can return full AI-generated answers.';
  }
}
