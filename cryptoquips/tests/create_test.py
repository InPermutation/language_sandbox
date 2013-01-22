#! usr/bin/env python

from cryptoquips import create

from unittest import TestCase

class CryptoquipTest(TestCase):
    setUp(self):
        self.trans_table = create._trans_table()
        self.quip        = create.cryptoquip
        self.words       = create.word_list()
        self.test_quip   = self.quip('this is a test')

    def trans_length(self):
        self.assertEqual(len(self.trans_table), 256,
                         'create.trans_table returns bad table')

    def crypto_length(self):
        self.assertEqual(len(self.test_quip), len(self.quip('what am i zest')),
                         'create.cryptoquip length not equal to quip')

    def crypto_upper(self):
        self.assertEqual(self.quip('spam'), self.quip('spam').upper(),
                         'create.cryptoquip does not return upper()')

    def words_present(self):
        self.assertTrue(len(self.words) > 10**4 * 4, 'wordlist error')