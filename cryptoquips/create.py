#! /usr/bin/env python

import os
import random

from collections import defaultdict
from itertools import chain
from string import ascii_uppercase, maketrans

import main

def word_list():
    return open(os.path.join(main.path(),'common_words.txt')).read().split('\n')

def word_dict():
    """keys are len(word), values are words that are that length"""
    word_dict = defaultdict(list)
    for word in word_list():
        word_dict[len(word)].append(word)
    return word_dict

def cryptoquip(quip):
    """a puzzle as a short piece of encrypted text, returned in uppercase"""
    return quip.upper().translate(_trans_table())

def min_replacement(word):
    """map a unique [A-Z] char to a unique letter in word. 'EGGS' -> 'ABBC'"""
    u_word = _unique_word(word)
    with_alpha = maketrans(u_word, ascii_uppercase[:len(u_word)])
    return word.translate(with_alpha)


def _trans_table():
    """create a random translation table from an uppercase English alphabet"""
    uppers = list(ascii_uppercase)
    random.shuffle(uppers)
    return maketrans(ascii_uppercase, ''.join(uppers))

def _unique_word(word):
    """preserve order of a word while returning only the unique letters in it"""
    seen = []
    for letter in word:
        if letter not in seen:
            seen.append(letter)
    return ''.join(seen)