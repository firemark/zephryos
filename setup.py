from setuptools import setup, find_packages

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
    ]
)