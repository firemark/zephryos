from setuptools import setup, find_packages
from setuptools.command.test import test as TestCommand
import sys


def run_setup():
    setup(
        name="Zephyros",
        version="0.1",
        url="https://github.com/firemark/zephryos",
        packages=find_packages(),
        install_requires=[
            'WTForms==2.0.1',
        ],
        tests_require=[
            'pytest==2.6.4'
        ],
        cmdclass={'test': PyTest},
    )


class PyTest(TestCommand):
    user_options = [
        ('pytest-args=', 'a', "Arguments to pass to py.test")
    ]

    def initialize_options(self):
        super().initialize_options()
        self.pytest_args = []

    def finalize_options(self):
        super().finalize_options()
        self.test_args = []
        self.test_suite = True

    def run_tests(self):
        #import here, cause outside the eggs aren't loaded
        import pytest
        errno = pytest.main(self.pytest_args)
        sys.exit(errno)


run_setup()