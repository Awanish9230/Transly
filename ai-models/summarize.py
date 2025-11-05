#!/usr/bin/env python3
"""
Summarize text using T5 or BART model
Usage: echo "text to summarize" | python summarize.py
"""

import sys

try:
    from transformers import pipeline
except ImportError:
    print("Error: transformers not installed. Install with: pip install transformers torch", file=sys.stderr)
    sys.exit(1)

def summarize_text(text, max_length=150, min_length=40):
    """
    Summarize text using BART model from Hugging Face
    """
    if not text or len(text.strip()) == 0:
        return "No text provided for summarization."
    
    # Initialize summarization pipeline
    # Using facebook/bart-large-cnn (good for summarization)
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    
    # Split long text into chunks if needed (BART has max token limit)
    max_chunk_length = 1024
    chunks = []
    
    words = text.split()
    current_chunk = []
    current_length = 0
    
    for word in words:
        current_length += len(word) + 1
        if current_length > max_chunk_length:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    # Summarize each chunk
    summaries = []
    for chunk in chunks:
        if len(chunk.strip()) > 50:  # Only summarize if chunk is substantial
            result = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)
            summaries.append(result[0]['summary_text'])
    
    # Combine summaries
    final_summary = " ".join(summaries)
    
    return final_summary

if __name__ == "__main__":
    # Read text from stdin
    text = sys.stdin.read()
    
    try:
        summary = summarize_text(text)
        print(summary)
    except Exception as e:
        print(f"Error during summarization: {str(e)}", file=sys.stderr)
        sys.exit(1)
