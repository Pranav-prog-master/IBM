"""
Bayesian Knowledge Tracing (BKT)
---------------------------------
Tracks P(student has mastered a topic) after each quiz response.

Parameters (standard BKT defaults, can be tuned per subject):
  L0 : prior probability of knowing the skill before any practice
  T  : probability of learning the skill after one opportunity (transition)
  G  : probability of guessing correctly without mastery
  S  : probability of slipping (making an error despite mastery)
"""

L0: float = 0.3
T: float  = 0.09
G: float  = 0.2
S: float  = 0.1

MASTERY_THRESHOLD: float = 0.75   # score above this → topic considered mastered


def update_mastery(p_mastery: float, correct: bool) -> float:
    """Return updated P(mastery) after one observation."""
    p_correct = p_mastery * (1 - S) + (1 - p_mastery) * G

    if correct:
        p_mastery_given_obs = (p_mastery * (1 - S)) / p_correct
    else:
        p_mastery_given_obs = (p_mastery * S) / (1 - p_correct)

    # Learning transition: even if wrong, student may have learned
    return p_mastery_given_obs + (1 - p_mastery_given_obs) * T


def get_difficulty(p_mastery: float) -> str:
    """Map mastery score to next question difficulty."""
    if p_mastery < 0.4:
        return "easy"
    if p_mastery < MASTERY_THRESHOLD:
        return "medium"
    return "hard"


def is_mastered(p_mastery: float) -> bool:
    return p_mastery >= MASTERY_THRESHOLD
