#! usr/bin/env python

import unittest

from cryptoquips import create

class TestCryptoquip(unittest.TestCase):

    def setUp(self):
        self.trans_table = create._random_trans_table()
        self.quip        = create.cryptoquip
        self.words       = create.word_list()
        self.test_quip   = self.quip('this is a test')

    def test_trans_length(self):
        self.assertEqual(len(self.trans_table), 256,
                         'create.trans_table returns bad table')

    def test_crypto_length(self):
        self.assertEqual(len(self.test_quip), len(self.quip('what am i zest')),
                         'create.cryptoquip length not equal to quip')

    def test_min_replace(self):
        self.assertEqual(create.min_replacement("MISSISSIPPI"), "ABCCBCCBDDB")

    def test_unique_word(self):
        self.assertEqual(create._unique_word("PROSPER"), "PROSE")

    def test_words_present(self):
        self.assertTrue(len(self.words) > 10**4 * 4, 'wordlist error')

if __name__ == '__main__':
    unittest.main()