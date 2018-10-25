import stylus
import pypugjs
import glob

import os

_cwd = os.getcwd()
compiler = stylus.Stylus()

def compile_files():
    pug_files = glob.glob(_cwd + "/web/**/*.pug", recursive=True)

    for pug_file in pug_files:
        with open(pug_file, "r") as f:
            w = open(os.path.splitext(pug_file)[0] + ".html", "w")
            w.write(pypugjs.simple_convert(f.read()))

    stylus_files = glob.glob(_cwd + "/web/**/*.styl", recursive=True)
    print(stylus_files)

    for stylus_file in stylus_files:
        with open(stylus_file, "r") as f:
            w = open(os.path.splitext(stylus_file)[0] + ".css", "w")
            w.write(compiler.compile(f.read()))
