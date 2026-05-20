from auth import login


def test_login():
    assert login("admin", "1234") is True

