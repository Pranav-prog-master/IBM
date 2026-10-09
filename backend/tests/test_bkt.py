from app.ai.bkt import get_difficulty, is_mastered, update_mastery


def test_update_mastery_correct():
    score = update_mastery(0.3, correct=True)
    assert score > 0.3


def test_update_mastery_incorrect():
    score = update_mastery(0.3, correct=False)
    assert 0.0 <= score <= 1.0


def test_mastery_increases_with_correct_answers():
    score = 0.3
    for _ in range(10):
        score = update_mastery(score, correct=True)
    assert score > 0.5


def test_is_mastered_true():
    assert is_mastered(0.8) is True


def test_is_mastered_false():
    assert is_mastered(0.4) is False


def test_get_difficulty_easy():
    assert get_difficulty(0.2) == "easy"


def test_get_difficulty_medium():
    assert get_difficulty(0.5) == "medium"


def test_get_difficulty_hard():
    assert get_difficulty(0.9) == "hard"
