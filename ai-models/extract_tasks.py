#!/usr/bin/env python3
"""
Extract action items and tasks from meeting transcript
Usage: echo "transcript text" | python extract_tasks.py
"""

import sys
import re
import json

def extract_tasks(text):
    """
    Extract tasks, deadlines, and assignees from transcript using NLP + regex
    """
    tasks = []
    
    # Common task keywords
    task_keywords = [
        r'need to',
        r'should',
        r'must',
        r'have to',
        r'will',
        r'going to',
        r'action item',
        r'todo',
        r'task',
        r'follow up',
        r'reach out',
        r'contact',
        r'schedule',
        r'prepare',
        r'create',
        r'send',
        r'review',
        r'complete',
        r'finish',
    ]
    
    # Date patterns
    date_patterns = [
        r'by (\w+day|\w+\s+\d{1,2})',
        r'before (\w+day|\w+\s+\d{1,2})',
        r'deadline[:\s]+(\w+)',
        r'due[:\s]+(\w+)',
    ]
    
    # Name patterns (simple - looks for capitalized words)
    name_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b'
    
    # Priority keywords
    priority_high = ['urgent', 'asap', 'critical', 'important', 'priority', 'immediately']
    priority_low = ['when possible', 'eventually', 'nice to have', 'optional']
    
    # Split text into sentences
    sentences = re.split(r'[.!?]+', text)
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        # Check if sentence contains task keywords
        contains_task = any(re.search(keyword, sentence, re.IGNORECASE) for keyword in task_keywords)
        
        if contains_task:
            # Extract deadline
            deadline = None
            for pattern in date_patterns:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    deadline = match.group(1)
                    break
            
            # Extract assignee (look for names)
            assignee = None
            names = re.findall(name_pattern, sentence)
            if names:
                assignee = names[0]  # Take first name found
            
            # Determine priority
            priority = 'medium'
            sentence_lower = sentence.lower()
            if any(word in sentence_lower for word in priority_high):
                priority = 'high'
            elif any(word in sentence_lower for word in priority_low):
                priority = 'low'
            
            # Create task object
            task = {
                'description': sentence,
                'assignedTo': assignee if assignee else 'Unassigned',
                'deadline': deadline if deadline else 'No deadline',
                'priority': priority
            }
            
            tasks.append(task)
    
    # Limit to top tasks if too many
    if len(tasks) > 10:
        # Prioritize high priority tasks
        high_priority = [t for t in tasks if t['priority'] == 'high']
        other_tasks = [t for t in tasks if t['priority'] != 'high']
        tasks = high_priority + other_tasks[:10-len(high_priority)]
    
    return tasks

if __name__ == "__main__":
    # Read text from stdin
    text = sys.stdin.read()
    
    try:
        tasks = extract_tasks(text)
        print(json.dumps(tasks, indent=2))
    except Exception as e:
        print(f"Error during task extraction: {str(e)}", file=sys.stderr)
        sys.exit(1)
