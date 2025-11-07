#!/usr/bin/env python3
"""
Transcribe audio using Whisper model
Usage: python transcribe.py <audio_file_path>
"""

import sys
import os
import io
import warnings

# ✅ Force UTF-8 for all console I/O (fixes 'charmap' errors on Windows)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ✅ Suppress FP16 CPU warning
warnings.filterwarnings("ignore", message="FP16 is not supported on CPU")

try:
    import whisper
except ImportError:
    print("Error: whisper not installed. Install with: pip install openai-whisper", file=sys.stderr)
    sys.exit(1)


def transcribe_audio(audio_path):
    """
    Transcribe audio file using Whisper model.
    """
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # Load Whisper model (choose 'base' for balance of speed & accuracy)
    model = whisper.load_model("base")

    # Perform transcription
    result = model.transcribe(audio_path)

    return result["text"]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)

    audio_file = sys.argv[1]

    try:
        transcript = transcribe_audio(audio_file)
        print(transcript)
    except Exception as e:
        print(f"Error during transcription: {str(e)}", file=sys.stderr)
        sys.exit(1)
