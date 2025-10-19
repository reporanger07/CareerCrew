#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from crew import CareerGuideAi

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run(user_input=None):
    """
    Run the crew.
    """
    if user_input is None:
        user_input = "AI LLMs"

    inputs = {
        'topic': user_input,
        'current_year': str(datetime.now().year)
    }
    
    try:
        CareerGuideAi().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


if __name__ == "__main__":
    user_input = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else None
    run(user_input)